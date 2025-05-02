import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/context/AuthContext';
import { listHouses } from '@/data/houses/houses';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type PropertyCardProps = {
  id: string,
  location: string;
  ownerName: string;
  minRent: number;
  maxRent: number;
  randomHouseId: number;
  randomUserId: number;
  image: string;
};

const API_URL = Constants.expoConfig?.extra?.apiUrl

const PropertyCard = ({ id, location, ownerName, minRent, maxRent, randomUserId, image }: PropertyCardProps) => {
  const houseImage = API_URL.replace("/api", "") + image;
  
  return (
    <View className="bg-white rounded-3xl shadow-2xl mb-8 overflow-hidden" onTouchEnd={() => router.push(`/house/${id}`)}>
      {/* Property Image */}
      <View className="relative">
        <View className="h-64 bg-gray-300">
          <Image
            source={{ uri: houseImage }}
            className="w-full h-full"
          />
          <TouchableOpacity className="absolute top-4 right-4">
            <Text className="text-4xl p-2 text-primary">★</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Details */}
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-semibold">{location}</Text>
          <Text className="text-lg">{minRent} € - {maxRent} €</Text>
        </View>

        {/* Profile Section */}
        <View className="flex-row items-center mt-2">
          <Image
            source={{ uri: `https://randomuser.me/api/portraits/men/${randomUserId}.jpg` }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="ml-3 text-lg">{ownerName}</Text>
        </View>
      </View>
    </View>
  );
};

const App = () => {
  const { token } = useAuth();
  const [houses, setHouses] = useState([] as any[]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await listHouses(token ?? "");
      const sliced = response.data.slice(1, 40);

      // Assign stable random IDs for image and user
      const withRandoms = sliced.map((house: any) => ({
        ...house,
        randomHouseId: Math.floor(Math.random() * 59),
        randomUserId: Math.floor(Math.random() * 99),
      }));

      setHouses(withRandoms);
    };

    fetchData();
  }, []);

  function formatAddress(address: string) {
    const parts = address.split(' ');
    return parts.slice(-2).join(' ');
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Search Bar */}
      <View className="px-6 py-3 mb-4">
        <View className="bg-white rounded-full px-6 border-2 border-gray-200">
          <TextInput 
            placeholder="Search" 
            defaultValue="Braga"
            className="text-base py-4"
          />
        </View>
      </View>

      {/* Property Listings */}
      <ScrollView className="flex-1 px-6">
        {houses.map((house, index) => (
          <PropertyCard
            id={house.id}
            key={index}
            location={formatAddress(house.address)}
            minRent={house.min_rent}
            maxRent={house.max_rent}
            ownerName={house.owner.name}
            randomHouseId={house.randomHouseId}
            randomUserId={house.randomUserId}
            image={house.image}
          />
        ))}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};


export default App;