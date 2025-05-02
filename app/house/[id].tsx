import { useAuth } from '@/context/AuthContext';
import { showHouse } from '@/data/houses/houses';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.apiUrl


const App = () => {
    const { token } = useAuth();
    const { id } = useLocalSearchParams();
    const [house, setHouse] = useState<{ image: string,  min_rent: number, max_rent: number, address : string, owner : any, tags : string[]} | null>(null);

    useEffect(() => {
        const fetchData = async () => {
        const response = await showHouse(id.toString(), token ?? "");

        setHouse(response.data);
        };

        fetchData();
    }, []);

    function formatAddress(address: string) {
        const parts = address.split(' ');
        return parts.slice(-2).join(' ');
    } 

    const houseImage = API_URL.replace("/api", "") + house?.image;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1">
        {/* Property Image Section */}
        <View className="relative h-80 ">
            <Image
                source={{ uri: houseImage }}
                className="w-full h-full"
            />
          <View className="absolute w-full flex-row justify-between p-4">
            <TouchableOpacity>
              <Text className="text-3xl text-gray-700">✕</Text>
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
          
          {/* Address Section */}
          <View className="mt-6">
            <Text className="text-xl mb-3">Morada</Text>
            <View className="h-40 bg-gray-200 rounded-lg overflow-hidden">
              <Image 
                source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Groveland,California&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY' }} 
                className="w-full h-full"
                resizeMode="cover"
              />
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