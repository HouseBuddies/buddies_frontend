import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/context/AuthContext';
import { listHouses } from '@/data/houses/houses';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
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

type PropertyCardProps = {
  id: string;
  location: string;
  ownerName: string;
  minRent: number;
  maxRent: number;
  randomHouseId: number;
  randomUserId: number;
  image: string;
  ownerPhoto: string;
  latitude?: number;
  longitude?: number;
};

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;

const PropertyCard = ({ id, location, ownerName, ownerPhoto, minRent, maxRent, randomUserId, image }: PropertyCardProps) => {
  const houseImage = API_URL.replace("/api", "") + image;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/house/${id}`)}
      className="bg-white rounded-3xl shadow-2xl mb-8 overflow-hidden"
    >
      {/* Property Image */}
      <View className="relative">
        <View className="h-64 bg-gray-300">
          <Image source={{ uri: houseImage }} className="w-full h-full" />
          <TouchableOpacity className="absolute top-4 right-4">
            <Text className="text-4xl p-2 text-primary">★</Text>
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

const DEFAULT_LAT = 41.5454;
const DEFAULT_LNG = -8.4265;

const HomeScreen = () => {
  const { token } = useAuth();
  const [houses, setHouses] = useState([] as any[]);
  const [refreshing, setRefreshing] = useState(false);
  const [isPulled, setIsPulled] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const pullDownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const response = await listHouses(token ?? "");
      const sliced = response.data.slice(1, 40);
      const withRandoms = sliced.map((house: any) => ({
        ...house,
        randomHouseId: Math.floor(Math.random() * 59),
        randomUserId: Math.floor(Math.random() * 99),
        latitude: DEFAULT_LAT + (Math.random() - 0.5) * 0.02,
        longitude: DEFAULT_LNG + (Math.random() - 0.5) * 0.02,
      }));
      setHouses(withRandoms);
      setRefreshing(false);
    };
    fetchData();
  }, [refreshing]);

  function formatAddress(address: string) {
    const parts = address.split(' ');
    return parts.slice(-2).join(' ');
  }

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

  const onRefresh = () => setRefreshing(true);

  const headerOpacity = pullDownAnim.interpolate({
    inputRange: [0, PULL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

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
              title={house.location}
              description={`Owned by ${house.ownerName}`}
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
        >
          {houses.map((house, index) => (
            <PropertyCard
              key={index}
              id={house.id}
              location={formatAddress(house.address)}
              rent={house.rent}
              ownerName={house.owner.name}
              randomHouseId={house.randomHouseId}
              randomUserId={house.randomUserId}
              image={house.image}
              latitude={house.latitude}
              longitude={house.longitude}
            />
          ))}
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
