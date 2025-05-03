import BottomNavigation from '@/components/BottomNavigation';
import TopNavigation from '@/components/TopNavigations';
import { useAuth } from '@/context/AuthContext'; // Import auth context for token
import { getHouseTasks, updateTask } from '@/data/houses'; // Import the task fetching function
import Checkbox from 'expo-checkbox';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

// Define Task interface based on the API response structure
interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  finished: boolean;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todo-list');
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id;
  
  // Get auth token from context
  const { token } = useAuth();

  // Fetch tasks when component mounts
  useEffect(() => {
    if (!id || !token) return;
    
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await getHouseTasks(id as string, token);
        
        // Handle the new data structure where tasks are within a "data" property
        if (tasksData && tasksData.data && Array.isArray(tasksData.data)) {
          setTasks(tasksData.data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [id, token]);

  // Toggle task completed status
  const toggleTask = (taskId: string, currentFinished: boolean) => {
    const updateTaskFinish = async () => {
      if (!token) return;
      try {
        const response = await updateTask(taskId, !currentFinished, token);
        if(response?.data) {
          setTasks(prev =>
            prev.map(task =>
              task.id === taskId ? { ...task, finished: !currentFinished } : task
            )
          );
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
    updateTaskFinish();
  };

  const handleTabChange = (route: string) => {
    router.push(`/management/${id}/${route}`);
  };

  const navigateToAdd = () => {
    router.push(`/management/${id}/create-todo`);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white"
      activeOpacity={0.7}
      onPress={() => toggleTask(item.id, item.finished)}
    >
      <View className="flex-row items-center">
        <Checkbox
          value={item.finished}
          onValueChange={() => toggleTask(item.id, item.finished)}
          color={item.finished ? '#4F46E5' : undefined}
        />
        <View className="ml-3 flex-1">
          <Text className={`${item.finished ? 'line-through text-gray-400' : 'text-black'} text-lg`}>
            {item.title}
          </Text>
          {item.description && (
            <Text className="text-sm text-gray-500">{item.description}</Text>
          )}
          {item.due_date && (
            <Text className="text-xs text-gray-500">
              Due: {new Date(item.due_date).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-gray-500 text-lg">No tasks found</Text>
      <TouchableOpacity
        onPress={navigateToAdd}
        className="mt-4 bg-indigo-600 rounded-lg py-2 px-4"
      >
        <Text className="text-white font-medium">Add Task</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Header with title and Add button */}
      <View className="p-4 border-b border-gray-200 bg-white flex-row items-center justify-between">
        <Text className="text-lg text-gray-700 font-medium">ToDo List</Text>
        <TouchableOpacity
          onPress={navigateToAdd}
          className="flex-row items-center justify-center bg-indigo-600 rounded-lg h-10 px-4"
        >
          <Text className="text-white text-lg font-bold">＋ Add Task</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 0, flexGrow: 1 }}
          ListEmptyComponent={renderEmptyList}
        />
      )}
      <BottomNavigation />
    </View>
  );
}
