import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/context/AuthContext';
import { fetchUserInfo } from '@/data/auth/auth';
import { getUserHouses } from '@/data/houses';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface House {
  id: string;
  address: string;
  image: string;
  available_date: string;
  min_rent: string;
  max_rent: string;
  rooms: number;
  max_residents: number;
  tags: string[];
}

interface User {
  id: string;
  name: string;
  photo?: string;
}

export default function Management() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [loadingHouses, setLoadingHouses] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch user data and houses
  const loadData = async () => {
    if (!token) return;
    
    // Fetch user data
    try {
      setLoadingUser(true);
      const userData = await fetchUserInfo(token);
      if (userData?.user) {
        setUser(userData.user);
        
        // Fetch houses after user is loaded
        try {
          setLoadingHouses(true);
          const response = await getUserHouses(userData.user.id, token);
          setHouses(response.data || response);
        } catch (err) {
          console.error('Error fetching houses:', err);
        } finally {
          setLoadingHouses(false);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoadingUser(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, [token]);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const ListingItem = ({ house }: { house: House }) => (
    <TouchableOpacity
      className="mb-4 w-full"
      activeOpacity={0.7}
      onPress={() => router.push(`/management/${house.id}/home`)}
    >
      <View className="rounded-xl overflow-hidden border border-gray-200 bg-white">
        <Image
          source={{ uri: house.image.startsWith('http') ? house.image : `https://your-api.com${house.image}` }}
          className="h-32 w-full"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="text-base font-semibold text-gray-800 mb-1">{house.address}</Text>
          <Text className="text-sm text-gray-600 mb-1">Available: {new Date(house.available_date).toLocaleDateString()}</Text>
          <Text className="text-sm text-gray-600 mb-1">Rent: €{house.min_rent} - €{house.max_rent} / mo</Text>
          <Text className="text-sm text-gray-600 mb-1">Rooms: {house.rooms} • Max Residents: {house.max_residents}</Text>
          {house.tags && house.tags.length > 0 && (
            <View className="flex-row flex-wrap">
              {house.tags.map(tag => (
                <Text key={tag} className="text-xs text-indigo-600 mr-2 mb-1">#{tag}</Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loadingUser) {
      return <Text className="text-center text-gray-500 py-8">Loading user...</Text>;
    }
    
    if (!user) {
      return <Text className="text-center text-red-500 py-8">Unable to load user.</Text>;
    }
    
    return (
      <>
        {/* User Header */}
        <View className="flex-row items-center mb-6 px-1">
          {user.photo && (
            <Image
              source={{ uri: user.photo }}
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <Text className="text-xl font-semibold">Welcome, {user.name}</Text>
        </View>

        {/* Listings */}
        {loadingHouses ? (
          <Text className="text-center text-gray-500 py-4">Loading listings...</Text>
        ) : houses.length > 0 ? (
          houses.map(house => <ListingItem key={house.id} house={house} />)
        ) : (
          <Text className="text-center text-gray-500 py-8">No properties found.</Text>
        )}
      </>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }} className="bg-white">
        <StatusBar barStyle="dark-content" />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          alwaysBounceVertical={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4f46e5']}
              tintColor="#4f46e5"
            />
          }
        >
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation />
      </View>
    </View>
  );
}