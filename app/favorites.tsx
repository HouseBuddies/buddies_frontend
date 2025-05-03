import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/context/AuthContext';
import { fetchUserInfo } from '@/data/auth/auth';
import { addFavoriteHouse, getUserFavoriteHouses, removeFavoriteHouse } from '@/data/houses/houses';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
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

interface SearchBarProps {
  onMapToggle: () => void;
  isMapVisible: boolean;
}

const API_URL = Constants.expoConfig?.extra?.apiUrl || '';

// SearchBar Component
const SearchBar = ({ onMapToggle, isMapVisible }: SearchBarProps) => {
  return (
    <View className="px-6 py-3 bg-gray-50 z-10">
      <View className="flex-row items-center bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
        <TextInput
          placeholder="Search location, tags, anything ..."
          className="flex-1 text-base py-4 px-6"
        />
        <TouchableOpacity 
          className="bg-primary p-3 rounded-full mr-2"
          onPress={onMapToggle}
          accessibilityLabel={isMapVisible ? "Hide map" : "Show map"}
        >
          <View className="w-6 h-6 items-center justify-center">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke="#ffffff" strokeWidth={2} />
              <Path
                d="M2 12h20M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10c-2.5-2.5-4-6-4-10s1.5-7.5 4-10z"
                stroke="#ffffff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
      className="bg-white rounded-2xl shadow-5xl mb-8 overflow-hidden" 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Property Image */}
      <View className="relative">
        <View className="h-64">
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
            <Text className={`text-4xl p-2 ${isFavorite ? 'text-primary' : 'text-white'}`}>
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

const FavoritesScreen = () => {
  const { token } = useAuth();
  const [houses, setHouses] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const pullDownAnim = useRef(new Animated.Value(0)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  // Add keyboard event listeners
  useEffect(() => {
    const keyboardWillShowSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardVisible(true);
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
        
        Animated.timing(keyboardAnim, {
          toValue: keyboardHeight,
          duration: Platform.OS === 'ios' ? 250 : 0,
          useNativeDriver: false,
        }).start();
      }
    );
    
    const keyboardWillHideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        
        Animated.timing(keyboardAnim, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 0,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  const formatAddress = useCallback((address: string) => {
    if (!address) return '';
    const parts = address.split(' ');
    return parts.slice(-2).join(' ');
  }, []);


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


  const fetchHouses = useCallback(async () => {
    if (!token || !user?.id) {
      console.warn('Skipping fetchHouses, missing', { token, userId: user?.id });
      setError(token ? 'User ID missing' : 'Authentication required');
      setIsLoading(false);
      return;
    }
  
    setError(null);
    setIsLoading(true);
  
    try {
      const response = await getUserFavoriteHouses(user.id, token);
  
      if (response?.data) {
        // pull out just the house objects
        const housesOnly = response.data.map((fav: { house: any, user: any }) => fav.house);
        console.log('Fetched houses:', housesOnly);
  
        const sliced = housesOnly.slice(0, 40);
        const withRandoms = sliced.map((house: any) => ({
          ...house,
          randomHouseId: Math.floor(Math.random() * 59),
          randomUserId: Math.floor(Math.random() * 99),
          latitude: DEFAULT_LAT + (Math.random() - 0.5) * 0.02,
          longitude: DEFAULT_LNG + (Math.random() - 0.5) * 0.02,
        }));
  
        setHouses(withRandoms);
      } else {
        console.warn('getUserFavoriteHouses returned no data:', response);
        setError('No houses found');
      }
    } catch (err: any) {
      console.error('Error fetching houses:', err.response ?? err);
      setError(err.response?.data?.message ?? 'Failed to load houses');
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.id]);
  

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

  // Navigate to house detail page
  const navigateToHouse = useCallback((houseId: string) => {
    router.push(`/house/${houseId}`);
  }, []);

  // Toggle map visibility
  const toggleMap = useCallback(() => {
    // Dismiss keyboard when toggling map
    Keyboard.dismiss();
    
    if (isMapVisible) {
      Animated.spring(pullDownAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7
      }).start(() => setIsMapVisible(false));
    } else {
      Animated.spring(pullDownAnim, {
        toValue: MAP_HEIGHT,
        useNativeDriver: false,
      }).start(() => setIsMapVisible(true));
    }
  }, [isMapVisible, pullDownAnim]);

  const headerOpacity = pullDownAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Dismiss keyboard when tapping outside the text input in the map view
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  console.log('Houses:', houses);
    console.log('Favorites:', favorites);
    console.log('User:', user);

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center p-4">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => loadData()}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" />

        {/* Map View */}
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
          <TouchableOpacity
            activeOpacity={1}
            onPress={dismissKeyboard}
            style={{ flex: 1 }}
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
              {houses.map((house) => (
                <Marker
                  key={house.id}
                  coordinate={{
                    latitude: house.latitude ?? DEFAULT_LAT,
                    longitude: house.longitude ?? DEFAULT_LNG,
                  }}
                >
                  <Callout
                    tooltip={false}
                    onPress={() => navigateToHouse(house.id)}
                  >
                    <View className="bg-white p-2 rounded-md min-w-40">
                      <Text className="font-bold">{formatAddress(house.address)}</Text>
                      <Text className="text-sm">{house.min_rent} € - {house.max_rent} €</Text>
                      <Text className="text-xs text-primary mt-1">Tap to view details</Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          </TouchableOpacity>

          {/* Map search bar that adjusts with keyboard and stays above bottom navigation */}
          <Animated.View 
            style={{
              position: 'absolute',
              bottom: keyboardAnim.interpolate({
                inputRange: [0, keyboardHeight],
                outputRange: [80, keyboardHeight], // 80px (5rem) above bottom navigation
                extrapolate: 'clamp',
              }),
              left: 0,
              right: 0,
              paddingBottom: 4,
              paddingTop: 2,
              paddingHorizontal: 24,
              zIndex: 10
            }}
          >
            <View className="flex-row items-center bg-white rounded-2xl border-2 border-gray-200 overflow-hidden my-4 shadow-lg">
              <TextInput
                placeholder="Search a city ..."
                className="flex-1 text-base py-4 px-6"
                onFocus={() => {
                  // Extra handling if needed on focus
                }}
              />
              <TouchableOpacity 
                className="bg-primary p-3 rounded-full mr-2"
                onPress={toggleMap}
                accessibilityLabel="Hide map"
              >
                <View className="w-6 h-6 items-center justify-center">
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="#ffffff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Main Scrollable Content */}
        <Animated.View 
          style={{ 
            flex: 1, 
            transform: [{ translateY: pullDownAnim }],
          }}
        >
          {/* Main search bar with map toggle button */}
          <SearchBar onMapToggle={toggleMap} isMapVisible={isMapVisible} />
          
          <Animated.ScrollView
            className="flex-1 px-6"
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            keyboardShouldPersistTaps="handled"
          >
            {houses.map((house, index) => {              
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
                  ownerPhoto={house.owner.photo}
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
        <Animated.View 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 10,
            transform: [
              {
                translateY: keyboardVisible ? keyboardAnim : 0
              }
            ]
          }}
        >
          <BottomNavigation />
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default FavoritesScreen;