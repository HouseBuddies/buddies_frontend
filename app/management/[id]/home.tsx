import BottomNavigation from '@/components/BottomNavigation';
import TopNavigation from '@/components/TopNavigations';
import { useAuth } from '@/context/AuthContext'; // Import auth context for token
import { getHouseBills, getHouseTasks, updateTask } from '@/data/houses'; // Make sure path is correct
import Checkbox from 'expo-checkbox';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface Task {
  id: string;
  title: string;      // Changed from 'name' to match new data structure
  description?: string; // Added new field from the data structure
  due_date: string;    // Added due_date from the data structure
  finished: boolean;   // Changed from 'completed' to match new data structure
  letter?: string;     // First letter for the circle (still keeping this for UI)
}

interface Bill {
  id: string;
  description: string;
  title: string;
  amount: number;
  due_date: string;
  price: number;
  paid: boolean;
}

const ToDoItem = ({ task, onToggle }: { task: Task; onToggle: (id: string, value: boolean) => void }) => {
    return (
        <TouchableOpacity className="flex-row items-center mb-2 border-2 border-gray-100 py-2 px-4 rounded-lg" onPress={() => onToggle(task.id, !task.finished)} activeOpacity={0.7}>
            <View className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Text className="text-primary font-semibold">{task.letter || task.title.charAt(0).toUpperCase()}</Text>
            </View>
            <View className="flex-1">
                <Text className={`${task.finished ? 'line-through text-gray-400' : ''}`}>{task.title}</Text>
                {task.description && (
                    <Text className="text-xs text-gray-500" numberOfLines={1}>{task.description}</Text>
                )}
                {task.due_date && (
                    <Text className="text-xs text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</Text>
                )}
            </View>
            <Checkbox
                value={task.finished}
                onValueChange={(value) => onToggle(task.id, value)}
                color={task.finished ? '#3B82F6' : undefined}
            />
        </TouchableOpacity>
    );
};

const PaymentItem = ({ bill, onPress }: { bill: Bill; onPress: () => void }) => (
    <TouchableOpacity className="flex-row items-center justify-between mb-2 py-2 border-2 border-gray-100 px-4 rounded-lg" onPress={onPress}>
        <View className="flex-1">
            <Text className={`${bill.paid ? 'text-gray-400' : 'text-gray-800'}`}>{bill.description}</Text>
            <Text className="text-sm text-gray-500">Due: {new Date(bill.due_date).toLocaleDateString()}</Text>
        </View>
        <View className="flex-row items-center">
            <Text className={`mr-2 font-medium ${bill.paid ? 'text-gray-400' : 'text-3B82F6'}`}>
                €{bill.price}
            </Text>
        </View>
    </TouchableOpacity>
);

export default function Home() {
    // Get route parameters
    const { id } = useLocalSearchParams();
    const { token } = useAuth();
    
    // State for data
    const [tasks, setTasks] = useState<Task[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadingBills, setLoadingBills] = useState(true);
    const [events, setEvents] = useState<Record<string, { marked: boolean, dotColor: string }>>({});
    
    // Initialize active tab as 'home'
    const [activeTab, setActiveTab] = useState('home');
    
    // Fetch tasks and bills data
    useEffect(() => {
        if (!id || !token) return;
        
        const fetchData = async () => {
            let tasksData = null;
            let billsData = null;
            
            try {
                // Fetch tasks
                setLoadingTasks(true);
                tasksData = (await getHouseTasks(id as string, token))
                
                // Handle the new data structure where tasks are within a "data" property
                if (tasksData && tasksData.data && Array.isArray(tasksData.data)) {
                    setTasks(tasksData.data.slice(0, 5)); // Limit to 5 tasks
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoadingTasks(false);
            }
            
            try {
                // Fetch bills

                setLoadingBills(true);
                billsData = (await getHouseBills(id as string, token));
                if (billsData && billsData.data && Array.isArray(billsData.data)) {
                    setBills(billsData.data.slice(0, 5)); // Limit to 5 bills
                    
                    // Create calendar events from bills
                    const calendarEvents: Record<string, { marked: boolean, dotColor: string }> = {};
                    billsData.data.forEach((bill: { due_date: string | number | Date; paid: any; }) => {
                        const dateKey = new Date(bill.due_date).toISOString().split('T')[0];
                        calendarEvents[dateKey] = {
                            marked: true,
                            dotColor: bill.paid ? '#10B981' : '#EF4444'
                        };
                    });
                    
                    // Add task due dates to calendar events
                    if (tasksData && tasksData.data && Array.isArray(tasksData.data)) {
                        tasksData.data.forEach(task => {
                            if (task.due_date) {
                                const dateKey = new Date(task.due_date).toISOString().split('T')[0];
                                calendarEvents[dateKey] = {
                                    marked: true,
                                    dotColor: task.finished ? '#10B981' : '#3B82F6'
                                };
                            }
                        });
                    }
                    
                    setEvents(calendarEvents);
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
            } finally {
                setLoadingBills(false);
            }
        };
        
        fetchData();
    }, [id, token]);
    
    // Handle task toggle
    const handleTaskToggle = (taskId: string, currentFinished: boolean) => {
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
    
    // Handle tab change
    const handleTabChange = (route: string) => {
        if (route === 'home') {
            // Already on home, no need to navigate
            setActiveTab(route);
        } else {
            // Navigate to different tab
            router.push(`/management/${id}/${route}`);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1">
                <TopNavigation activeTab={activeTab} onTabChange={route => handleTabChange(route)} />

                <ScrollView className="flex-1 px-4 mt-4">
                    {/* Property ID Indicator */}
                    <View className="mt-2 mb-4">
                        <Text className="text-sm text-gray-500">Property ID: {id}</Text>
                    </View>
                
                    {/* To Do Section */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold mb-2">To Do</Text>
                        {loadingTasks ? (
                            <ActivityIndicator size="small" color="#4F46E5" />
                        ) : tasks.length > 0 ? (
                            tasks.map(task => (
                                <ToDoItem 
                                    key={task.id} 
                                    task={task} 
                                    onToggle={() => handleTaskToggle(task.id, task.finished)}
                                />
                            ))
                        ) : (
                            <Text className="text-gray-500 italic">No tasks found</Text>
                        )}
                    </View>

                    {/* Payments Section */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold mb-2">Payments</Text>
                        {loadingBills ? (
                            <ActivityIndicator size="small" color="#4F46E5" />
                        ) : bills.length > 0 ? (
                            <View>
                                {bills.map(bill => (
                                    <PaymentItem 
                                        key={bill.id} 
                                        bill={bill} 
                                        onPress={() => {
                                            // Navigate to bill details or payment screen
                                            // router.push(`/management/${id}/bills/${bill.id}`);
                                            console.log('Bill pressed:', bill.id);
                                        }} 
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text className="text-gray-500 italic">No bills found</Text>
                        )}
                    </View>

                    {/* Calendar Section */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold mb-2">Calendar</Text>
                        <Calendar
                            current={new Date().toISOString().split('T')[0]}
                            onDayPress={(day) => {
                                console.log('selected day', day);
                                // You could filter and show bills/tasks for this day
                            }}
                            monthFormat={'MMMM yyyy'}
                            markedDates={events}
                            theme={{
                                arrowColor: '#3B82F6',
                                textMonthFontWeight: 'bold',
                                todayTextColor: '#3B82F6',
                                selectedDayBackgroundColor: '#3B82F6',
                            }}
                        />
                        <View className="flex-row mt-2 justify-center">
                            <View className="flex-row items-center mr-4">
                                <View className="w-3 h-3 rounded-full bg-red-500 mr-1" />
                                <Text className="text-xs text-gray-600">Pending Bills</Text>
                            </View>
                            <View className="flex-row items-center mr-4">
                                <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                                <Text className="text-xs text-gray-600">Paid Bills</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-3 h-3 rounded-full bg-primary mr-1" />
                                <Text className="text-xs text-gray-600">Tasks</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomNavigation activeTab='home' />
        </SafeAreaView>
    );
}