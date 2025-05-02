import TopNavigation from '@/components/TopNavigations';
import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

// Mock data: list of todos with title and assignee
const initialTodos = [
  { id: '1', title: 'Finish project report', assignedTo: 'Alice', completed: false },
  { id: '2', title: 'Update client on status', assignedTo: 'Bob', completed: false },
  { id: '3', title: 'Design new logo', assignedTo: 'Charlie', completed: false },
  { id: '4', title: 'Plan team meeting', assignedTo: 'Dana', completed: false },
];

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [activeTab, setActiveTab] = useState('todo-list');
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id;

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleTabChange = (route: string) => {
    router.push(`/management/1/${route}`);
  };

  const navigateToAdd = () => {
    router.push('/management/1/create-todo');
  };

  const renderItem = ({ item }: { item: typeof initialTodos[0] }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 border-b border-gray-200 bg-white"
      activeOpacity={0.7}
      onPress={() => toggleTodo(item.id)}
    >
      <View className="flex-row items-center">
        <Checkbox
          value={item.completed}
          onValueChange={() => toggleTodo(item.id)}
          color={item.completed ? '#4F46E5' : undefined}
        />
        <View className="ml-3">
          <Text className={`${item.completed ? 'line-through text-gray-400' : 'text-black'} text-lg`}>{item.title}</Text>
          <Text className="text-sm text-gray-500">Assigned to: {item.assignedTo}</Text>
        </View>
      </View>
    </TouchableOpacity>
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

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}
