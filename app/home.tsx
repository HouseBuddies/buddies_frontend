import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/context/AuthContext';
import { fetchUserInfo } from '@/data/auth/auth';
import { addFavoriteHouse, getUserFavoriteHouses, listHouses, removeFavoriteHouse } from '@/data/houses/houses';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PULL_THRESHOLD = 100;
const MAP_HEIGHT = SCREEN_HEIGHT;
const DEFAULT_LAT = 41.5454;
const DEFAULT_LNG = -8.4265;

// Define proper TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  age?: number;
}

interface House {
  id: string;
  address: string;
  min_rent: number;
  max_rent: number;
  owner: {
    id: string;
    name: string;
  };
  image: string;
  randomHouseId?: number;
  randomUserId?: number;
  latitude?: number;
  longitude?: number;
}

interface PropertyCardProps {
  id: string;
  location: string;
  ownerName: string;
  minRent: number;
  maxRent: number;
  randomUserId: number;
  image: string;
  ownerPhoto: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  latitude?: number;
  longitude?: number;
}

const API_URL = Constants.expoConfig?.extra?.apiUrl || '';

const PropertyCard = ({ 
  id, 
  location, 
  ownerName, 
  minRent, 
  maxRent, 
  randomUserId, 
  image, 
  ownerPhoto,
  isFavorite, 
  onToggleFavorite 
}: PropertyCardProps) => {
  const houseImage = `${API_URL.replace("/api", "")}${image}`;
  
  const handlePress = useCallback(() => {
    router.push(`/house/${id}`);
  }, [id]);

  const handleFavoritePress = useCallback((e: any) => {
    e.stopPropagation();
    onToggleFavorite(id);
  }, [id, onToggleFavorite]);
  
  return (
    <TouchableOpacity 
      className="bg-white rounded-3xl shadow-2xl mb-8 overflow-hidden" 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Property Image */}
      <View className="relative">
        <View className="h-64 bg-gray-300">
          <Image
            source={{ uri: houseImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity 
            className="absolute top-4 right-4"
            onPress={handleFavoritePress}
            accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Text className={`text-4xl p-2 ${isFavorite ? 'text-red-500' : 'text-gray-700'}`}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-semibold">{location}</Text>
          <Text className="text-lg">{minRent} € - {maxRent} €</Text>
        </View>
        <View className="flex-row items-center mt-2">
          <Image
            source={{ uri: ownerPhoto }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="ml-3 text-lg">{ownerName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const { token } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPulled, setIsPulled] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const pullDownAnim = useRef(new Animated.Value(0)).current;

  const formatAddress = useCallback((address: string) => {
    if (!address) return '';
    const parts = address.split(' ');
    return parts.slice(-2).join(' ');
  }, []);

  const fetchHouses = useCallback(async () => {
    if (!token) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await listHouses(token);
      if (response?.data) {
        const sliced = response.data.slice(1, 40);
        
        // Assign stable random IDs for image and user and map coordinates
        const withRandoms = sliced.map((house: House) => ({
          ...house,
          randomHouseId: Math.floor(Math.random() * 59),
          randomUserId: Math.floor(Math.random() * 99),
          latitude: DEFAULT_LAT + (Math.random() - 0.5) * 0.02,
          longitude: DEFAULT_LNG + (Math.random() - 0.5) * 0.02,
        }));

        setHouses(withRandoms);
      }
    } catch (err) {
      console.error('Error fetching houses:', err);
      setError('Failed to load houses');
    }
  }, [token]);

  const fetchUserData = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetchUserInfo(token);
      if (response?.user) {
        setUser(response.user);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, [token]);

  const fetchFavorites = useCallback(async () => {
    if (!token || !user?.id) return;
    
    try {
      const response = await getUserFavoriteHouses(user.id, token);
      if (response?.data) {
        const favoriteIds = new Set(
          response.data.map((favorite: { house: { id: string } }) => favorite.house.id)
        );
        setFavorites(favoriteIds as Set<string>);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  }, [token, user]);

  const loadData = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      await fetchUserData();
      await fetchHouses();
      
      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [fetchUserData, fetchHouses]);

  // Initial data loading
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch favorites when user is loaded
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const toggleFavorite = useCallback(async (houseId: string) => {
    if (!token || !user?.id) {
      Alert.alert('Error', 'You need to be logged in to favorite houses');
      return;
    }
  
    const isFavorite = favorites.has(houseId);
    const previousFavorites = new Set(favorites);
  
    // Optimistically update UI
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.delete(houseId);
    } else {
      newFavorites.add(houseId);
    }
    setFavorites(newFavorites);
  
    try {
      const response = isFavorite
        ? await removeFavoriteHouse(houseId, user.id, token)
        : await addFavoriteHouse(houseId, user.id, token);
  
      const success = isFavorite ? response.data?.value : response.data?.id;
      

      if (!success) {
        setFavorites(previousFavorites);
        Alert.alert('Error', 'Failed to update favorites');
      }
    } catch (err) {
      setFavorites(previousFavorites);
      Alert.alert('Error', 'An error occurred while updating favorites');
    }
  }, [token, user, favorites]);
  
  

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (isPulled) return Math.abs(gestureState.dy) > 5;
        return scrollY._value <= 0 && gestureState.dy > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isPulled) {
          if (gestureState.dy < 0) {
            const pullDistance = Math.max(0, MAP_HEIGHT + gestureState.dy);
            pullDownAnim.setValue(pullDistance);
            if (pullDistance < PULL_THRESHOLD) setIsPulled(false);
          }
        } else if (scrollY._value <= 0 && gestureState.dy > 0) {
          const pullDistance = Math.min(gestureState.dy * 0.5, MAP_HEIGHT);
          pullDownAnim.setValue(pullDistance);
          if (pullDistance >= PULL_THRESHOLD) setIsPulled(true);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isPulled) {
          if (gestureState.dy < -20) {
            Animated.spring(pullDownAnim, {
              toValue: 0,
              useNativeDriver: false,
              tension: 50,
              friction: 7
            }).start(() => setIsPulled(false));
          } else {
            Animated.spring(pullDownAnim, {
              toValue: MAP_HEIGHT,
              useNativeDriver: false,
            }).start();
          }
        } else {
          if (pullDownAnim._value >= PULL_THRESHOLD) {
            Animated.spring(pullDownAnim, {
              toValue: MAP_HEIGHT,
              useNativeDriver: false,
            }).start(() => setIsPulled(true));
          } else {
            Animated.spring(pullDownAnim, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        }
      },
    })
  ).current;

  const handleCollapseHeader = () => {
    if (isPulled) {
      Animated.spring(pullDownAnim, {
        toValue: 0,
        useNativeDriver: false,
      }).start(() => setIsPulled(false));
    }
  };

  const headerOpacity = pullDownAnim.interpolate({
    inputRange: [0, PULL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center p-4">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => loadData()}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Pull-down Map View */}
      <Animated.View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: pullDownAnim,
          opacity: headerOpacity,
          zIndex: 1,
          overflow: 'hidden'
        }}
        className="bg-gray-50"
      >
        <MapView
          style={{ width: SCREEN_WIDTH, height: MAP_HEIGHT }}
          initialRegion={{
            latitude: DEFAULT_LAT,
            longitude: DEFAULT_LNG,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          zoomEnabled={true}
          pitchEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
        >
          {houses.map((house, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: house.latitude ?? DEFAULT_LAT,
                longitude: house.longitude ?? DEFAULT_LNG,
              }}
              title={formatAddress(house.address)}
              description={`Owned by ${house.owner.name}`}
            />
          ))}
        </MapView>

        {/* Map search bar and Close button */}
        <View className="absolute bottom-16 left-0 right-0 px-6 py-3 bg-gray-50 z-10">
          <TouchableOpacity
            className="mb-4 bg-primary rounded-full py-3 px-6 self-center"
            onPress={handleCollapseHeader}
          >
            <Text className="text-white text-base font-semibold">Close Map</Text>
          </TouchableOpacity>
          <View className="bg-white rounded-full px-6 pb-2 border-2 border-gray-200">
            <TextInput
              placeholder="Search location, tags, anything ..."
              className="text-base py-4"
            />
          </View>
        </View>
      </Animated.View>

      {/* Main Scrollable Content */}
      <Animated.View style={{ flex: 1, transform: [{ translateY: pullDownAnim }] }}>
        {/* Main search bar */}
        <View className="px-6 py-3 bg-gray-50 z-10">
          <View className="bg-white rounded-full px-6 pb-2 border-2 border-gray-200">
            <TextInput
              placeholder="Search location, tags, anything ..."
              className="text-base py-4"
            />
          </View>
        </View>
        
        <Animated.ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          {...panResponder.panHandlers}
          onScrollBeginDrag={() => {
            if (isPulled) handleCollapseHeader();
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {houses.map((house, index) => {
            const ownerPhoto = `https://randomuser.me/api/portraits/men/${house.randomUserId || 1}.jpg`;
            
            return (
              <PropertyCard
                key={house.id || index}
                id={house.id}
                location={formatAddress(house.address)}
                minRent={house.min_rent}
                maxRent={house.max_rent}
                ownerName={house.owner.name}
                randomUserId={house.randomUserId || 1}
                image={house.image}
                ownerPhoto={ownerPhoto}
                isFavorite={favorites.has(house.id)}
                onToggleFavorite={toggleFavorite}
                latitude={house.latitude}
                longitude={house.longitude}
              />
            );
          })}
        </Animated.ScrollView>
      </Animated.View>

      {/* Fixed Bottom Navigation */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;