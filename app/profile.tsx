import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/context/AuthContext';
import { fetchUserInfo, sign_out } from '@/data/auth/auth';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface User {
  id: string;
  name: string;
  age?: number;
  email?: string;
  username?: string;
  photo?: string;
}

interface SettingsOption {
  title: string;
  icon: string;
  onPress?: () => void;
}

const SettingsScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Assuming logout function exists in AuthContext

  // Fetch user data when component mounts
  useEffect(() => {
    let isMounted = true;
  
    const getUserData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const userData = await fetchUserInfo(token);
        
        // Only update state if component is still mounted
        if (isMounted && userData?.user) {
          setUser(userData.user);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching user data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    getUserData();
  
    return () => {
      isMounted = false; // cleanup
    };
  }, [token]);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            async () => {
              if (!token) return;
              try {
                await sign_out(token);
                console.log('Logged out successfully');
              } catch (err) {
                console.error('Error logging out:', err);
              }
            }
          }
        }
      ]
    );
  };

  const settingsOptions: SettingsOption[] = [
    { 
      title: 'Saved Messages', 
      icon: 'bookmark',
      onPress: () => console.log('Saved Messages pressed')
    },
    { 
      title: 'Recent Calls', 
      icon: 'phone',
      onPress: () => console.log('Recent Calls pressed')
    },
    { 
      title: 'Devices', 
      icon: 'smartphone',
      onPress: () => console.log('Devices pressed')
    },
    { 
      title: 'Notifications', 
      icon: 'bell',
      onPress: () => console.log('Notifications pressed')
    },
    { 
      title: 'Appearance', 
      icon: 'eye',
      onPress: () => console.log('Appearance pressed')
    },
    { 
      title: 'Language', 
      icon: 'globe',
      onPress: () => console.log('Language pressed')
    },
    { 
      title: 'Privacy & Security', 
      icon: 'lock',
      onPress: () => console.log('Privacy & Security pressed')
    },
    { 
      title: 'Storage', 
      icon: 'hard-drive',
      onPress: () => console.log('Storage pressed')
    },
  ];

  const renderSettingsItem = (item: SettingsOption, index: number): React.ReactElement => (
    <TouchableOpacity 
      key={index}
      className="flex-row items-center justify-between py-4 border-b border-gray-200"
      onPress={item.onPress || (() => {
        console.log(`${item.title} pressed`);
        // For debugging - show alert with user data when pressing the first setting
        if (index === 0 && __DEV__) {
          Alert.alert(
            'Debug Info',
            `User data: ${user ? JSON.stringify(user, null, 2) : 'undefined'}`,
            [{ text: 'OK' }]
          );
        }
      })}
    >
      <View className="flex-row items-center">
        <Feather name={item.icon as any} size={20} color="#3b82f6" />
        <Text className="text-gray-700 text-lg font-medium ml-3">{item.title}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );

  const renderProfileSection = () => {
    if (loading) {
      return (
        <View className="items-center justify-center mb-8 py-4">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-gray-500">Loading profile...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View className="items-center mb-8 py-4">
          <Feather name="alert-circle" size={40} color="#ef4444" />
          <Text className="text-red-500 mt-2">{error}</Text>
          <TouchableOpacity 
            className="mt-3 px-4 py-2 bg-blue-500 rounded-lg"
            onPress={() => {
              setError(null);
              setLoading(true);
              // Retry fetching user data
              fetchUserInfo(token!)
                .then(userData => {
                  if (userData?.user) setUser(userData.user);
                  setLoading(false);
                })
                .catch(err => {
                  setError('Failed to load user data');
                  setLoading(false);
                });
            }}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View className="items-center mb-8">
        <View className="relative">
          {user?.photo ? (
            <Image 
              source={{ uri: user.photo }} 
              className="h-24 w-24 rounded-full"
              // Add default image on error
              onError={() => console.log('Error loading profile image')}
            />
          ) : (
            <View className="h-24 w-24 rounded-full bg-blue-100 items-center justify-center">
              <Feather name="user" size={40} color="#60a5fa" />
            </View>
          )}
          <TouchableOpacity 
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2"
            onPress={() => console.log('Edit profile')}
          >
            <Feather name="edit-2" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-2xl font-bold mt-4 text-gray-800">
          {user?.name || 'User Profile'}
        </Text>
        
        {user?.email && (
          <Text className="text-gray-500 mt-1">
            {user.email}
          </Text>
        )}
        
        <Text className="text-gray-500">
          {user ? `@${user.username || user.id?.substring(0, 8) || 'user'}` : '@user'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" /> 
      
      <ScrollView className="flex-1 px-4">
        {/* Settings Header */}
        <View className="items-center mt-4 mb-6">
          <Text className="text-2xl font-bold text-gray-800">Settings</Text>
        </View>
        
        {/* Profile Section */}
        {renderProfileSection()}
        
        {/* Settings Options */}
        <View>
          {settingsOptions.map(renderSettingsItem)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="mt-8 mb-4 py-3 bg-red-50 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-red-500 text-center font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <BottomNavigation />
      
    </SafeAreaView>
  );
};

export default SettingsScreen;