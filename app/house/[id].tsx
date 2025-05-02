import { useAuth } from '@/context/AuthContext';
import { showHouse } from '@/data/houses/houses';
import Constants from 'expo-constants';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const { width } = Dimensions.get('window');

const App = () => {
    const { token } = useAuth();
    const { id } = useLocalSearchParams();
    const [house, setHouse] = useState<{ image: string,  min_rent: number, max_rent: number, address : string, owner : any, tags : string[]} | null>(null);

  const apiKey = Constants.expoConfig?.extra?.googleApiKey;
  
  // Custom map dimensions - adjust these values as needed
  const mapHeight = 270; // Height in pixels
  const mapWidth = width - 32; // Width based on screen size minus padding
  const mapSize = `${Math.round(mapWidth)}x${mapHeight}`;
  
  // Map configuration
  const circleRadius = 300; // Radius in meters
  const circleColor = "0x8AADF488"; // Circle color with alpha (RGBA)
  const circleBorder = "0x3B82F6"; // Border color for the circle

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showHouse(id.toString(), token ?? '');
        setHouse(response.data);
      } catch (error) {
        console.error("Error fetching house data:", error);
      }
    };

    fetchData();
  }, [id, token]);

  function formatAddress(address: string) {
    if (!address) return "";
    const parts = address.split(' ');
    return parts.slice(-2).join(' ');
  }

  const houseImage = house?.image ? API_URL.replace('/api', '') + house.image : '';

  // Create static map URL with only a circle (no marker)
  const getStaticMapUrl = () => {
    if (!house?.address || !apiKey) return '';
    
    // For a simple radius circle without a pin
    return `https://maps.googleapis.com/maps/api/staticmap?`+
           `center=${encodeURIComponent(house.address)}`+
           `&zoom=15`+
           `&size=${mapSize}`+
           `&scale=2`+ // For better resolution on high-density screens
           // Circle with fill color
           `&path=fillcolor:${circleColor}`+
           `%7Ccolor:${circleBorder}`+
           `%7Cweight:1`+
           `%7Ccenter:${encodeURIComponent(house.address)}`+
           `%7Cradius:${circleRadius}`+
           `&key=${apiKey}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1">
        {/* Property Image Section */}
        <View className="relative h-80">
          {houseImage !== '' && (
            <Image source={{ uri: houseImage }} className="w-full h-full" />
          )}
          <View className="absolute w-full flex-row justify-between p-4">
            <TouchableOpacity onPress={() => router.back()} >
              <Text className="text-3xl text-gray-700">X</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-3xl text-gray-700">★</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Property Details */}
        <View className="p-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-semibold">{formatAddress(house?.address || "")}</Text>
            <Text className="text-lg">{house?.min_rent} € - {house?.max_rent} €</Text>
          </View>

          {/* Profile Section */}
          <View className="flex-row items-center mt-4">
            <Image 
              source={{ uri: house?.owner.photo }} 
              className="w-12 h-12 rounded-full"
            />
            <Text className="ml-3 text-lg">{house?.owner.name}</Text>
          </View>
          
          {/* Interests Section */}
          <View className="mt-6">
            <Text className="text-xl mb-3">Interesses</Text>
            <View className="flex-row space-x-2">
              {house?.tags.map((interest, index) => (
                <View key={index} className="py-2 px-4 border border-gray-300 rounded-full">
                  <Text>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Address Section with Static Map */}
          <View className="mt-6">
            <Text className="text-xl mb-3">Morada</Text>
            {house?.address && apiKey && (
              <View style={{ 
                height: mapHeight-30, 
                width: mapWidth, 
                backgroundColor: '#e5e5e5', 
                borderRadius: 8, 
                overflow: 'hidden'
              }}>
                <Image
                  source={{ uri: getStaticMapUrl() }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View className="absolute p-16 bg-blue-300/40 border border-2 border-blue-400 rounded-full mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                </View>
              </View>
            )}


          </View>

                    {/* Property Features Section */}
          <View className="mt-6">
          <Text className="text-xl mb-3">Características específicas</Text>
          <View className="space-y-2">
            {[
              '58 m² área bruta',
              'T1',
              '1 casa de banho',
              'Varanda',
              'Lugar de garagem incluído no preço',
              'Segunda mão/bom estado',
              'Armários embutidos',
              'Orientação Sul',
              'Mobilado e cozinha equipada',
              'Aquecimento individual: Elétrico',
            ].map((item, index) => (
              <View key={index} className="flex-row items-center">
                <Text className="text-base">• {item}</Text>
              </View>
            ))}
          </View>

          {/* Two-Column Section */}
          <View className="flex-row mt-6">
            {/* Left Column */}
            <View className="flex-1 pr-2">
              <Text className="text-xl mb-3">Equipamento</Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Text className="text-base">• Ar condicionado</Text>
                </View>
              </View>

              <View className="mt-6">
                <Text className="text-xl mb-3">Prédio</Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Text className="text-base">• 1º andar</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-base">• Com elevador</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View className="flex-1 pl-2">
              <Text className="text-xl mb-3">Certificado energético</Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Text className="text-base">• Classe energética: A+</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

          </View>
        
      </ScrollView>

      

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center p-4 border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">⊞</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">★</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
            <Text className="text-2xl text-white">🔍</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">💬</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;