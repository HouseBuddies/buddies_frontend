import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const settingsOptions = [
    { title: 'Saved Messages', icon: 'bookmark' },
    { title: 'Recent Calls', icon: 'phone' },
    { title: 'Devices', icon: 'smartphone' },
    { title: 'Notifications', icon: 'bell' },
    { title: 'Appearance', icon: 'eye' },
    { title: 'Language', icon: 'globe' },
    { title: 'Privacy & Security', icon: 'lock' },
    { title: 'Storage', icon: 'hard-drive' },
  ];

  const renderSettingsItem = (item, index) => (
    <TouchableOpacity 
      key={index}
      className="flex-row items-center justify-between py-4 border-b border-gray-200"
      onPress={() => console.log(`${item.title} pressed`)}
    >
      <Text className="text-gray-700 text-lg font-medium">{item.title}</Text>
      <Feather name="chevron-right" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );
  const User =({id, name, photo}) => { const userImage = API_URL.replace("/user", "") 
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" /> 
      
      <ScrollView className="flex-1 px-4">
        {/* Settings Header */}
        <View className="items-center mt-4 mb-6">
          <Text className="text-2xl font-bold text-gray-800">Settings</Text>
        </View>
        
        {/* Profile Section */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="h-24 w-24 rounded-full bg-blue-100 items-center justify-center">
              <View className="h-16 w-16 rounded-full bg-blue-300" />
            </View>
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2"
              onPress={() => console.log('Edit profile')}
            >
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-bold mt-4 text-gray-800">Lucas Scott</Text>
          <Text className="text-gray-500">@lucasscott3</Text>
        </View>
        
        {/* Settings Options */}
        <View>
          {settingsOptions.map(renderSettingsItem)}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-3 border-t border-gray-200 bg-white">
        <TouchableOpacity className="items-center">
          <Feather name="grid" size={24} color="#1f2937" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="star" size={24} color="#1f2937" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="search" size={24} color="#1f2937" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="user" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;