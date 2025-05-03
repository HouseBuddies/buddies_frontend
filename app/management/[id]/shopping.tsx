import BottomNavigation from '@/components/BottomNavigation';
import TopNavigation from '@/components/TopNavigations';
import { useAuth } from '@/context/AuthContext';
import { fetchUserInfo } from '@/data';
import { listHouseProducts, updateShoppingItemState } from '@/data/houses';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ShoppingItem {
  id: string;
  name: string;
  state: string;
  created_at: string;
  quantity: number;
  created_by: {
    id: string;
    name: string;
    photo?: string;
  };
}

export default function ShoppingPage() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shopping');
  const [user, setUser] = useState<{ id: string; name: string; photo?: string } | null>(null);

  useEffect(() => {
    if (!id || !token) return;

    const fetchShoppingItems = async () => {
      setLoading(true);
      try {
        const res = await listHouseProducts(id as string, token);
        const data = Array.isArray(res.data) ? res.data : [];
        setShoppingItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingItems();
  }, [id, token]);

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

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const formatDate = (iso: string) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' } as const;
    return new Date(iso).toLocaleDateString(undefined, options);
  };

  const toggleBought = async (itemId: string, itemState: string) => {
    if (!id || !token) return;
    try {
      itemState = itemState === 'purchased' ? 'available' : 'purchased';
      const res = await updateShoppingItemState(id as string, itemId, itemState, user?.id, token);
      const updatedItem: Partial<ShoppingItem> = res.data;

      // Update local state with backend response
      setShoppingItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, state: updatedItem.state ?? item.state } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = () => {
    router.push(`/management/${id}/create-shopping-item`);
  };

  const handleTabChange = (route: string) => {
    setActiveTab(route);
    if (route !== 'shopping') {
      router.push(`/management/${id}/${route}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <ScrollView className="flex-1 px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-semibold text-gray-800">Shopping Cart</Text>
          <Pressable
            onPress={handleAddItem}
            className="flex-row items-center bg-blue-600 px-4 py-2 rounded-xl shadow-md"
          >
            <Icon name="plus" size={18} color="white" />
            <Text className="text-white font-medium ml-2">Add Item</Text>
          </Pressable>
        </View>

        {loading ? (
          <Text className="text-gray-500">Loading...</Text>
        ) : shoppingItems.length === 0 ? (
          <Text className="text-gray-500">No items in shopping list</Text>
        ) : (
          shoppingItems.map(item => (
            <TouchableOpacity
              onPress={() => toggleBought(item.id, item.state)}
              key={item.id}
              className="bg-white p-4 mb-4 rounded-2xl shadow-lg flex-row items-center justify-between"
            >
              <View className="flex-row items-start space-x-3 flex-1">
                <View className="flex-1">
                  <Text
                    className={`text-lg font-semibold ${item.state == 'purchased' ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                  >
                    {item.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Image
                      source={{ uri: item.created_by.photo || 'https://via.placeholder.com/32' }}
                      className="w-8 h-8 rounded-full"
                    />
                    <View className="flex flex-col ">
                      <Text className="text-xs text-gray-500 ml-2">
                        {`Quantity: ${item.quantity}`}
                      </Text>
                      <Text className="text-xs text-gray-500 ml-2">
                        {`Added by ${item.created_by.name} on ${formatDate(item.created_at)}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Icon
                name={item.state == 'purchased' ? 'check-circle' : 'x-circle'}
                size={24}
                color={item.state == 'purchased' ? '#10B981' : 'red'}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}
