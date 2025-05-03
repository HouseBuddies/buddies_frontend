import BottomNavigation from '@/components/BottomNavigation';
import TopNavigation from '@/components/TopNavigations';
import { useAuth } from '@/context/AuthContext';
import { getHouseActivities, getHouseBills, getHouseTasks } from '@/data/houses';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Feather';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  finished: boolean;
  letter?: string;
}

interface Bill {
  id: string;
  description: string;
  title: string;
  amount: number;
  due_date: string;
  paid: boolean;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function CalendarPage() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Record<string, { marked: boolean; dotColor: string }>>({});
  const [activeTab, setActiveTab] = useState('calendar');
  const [viewType, setViewType] = useState<'tasks' | 'activities'>('tasks');

  useEffect(() => {
    if (!id || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const tasksRes = await getHouseTasks(id as string, token);
        const billsRes = await getHouseBills(id as string, token);
        const activitiesRes = await getHouseActivities(id as string, token);

        const tData = Array.isArray(tasksRes.data) ? tasksRes.data.slice(0, 5) : [];
        const bData = Array.isArray(billsRes.data) ? billsRes.data.slice(0, 5) : [];
        const aData = Array.isArray(activitiesRes.data) ? activitiesRes.data : [];

        setTasks(
          tData.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        );
        setBills(bData);
        setActivities(aData);

        const calendarEvents: Record<string, { marked: boolean; dotColor: string }> = {};

        bData.forEach(bill => {
          const key = new Date(bill.due_date).toISOString().split('T')[0];
          calendarEvents[key] = { marked: true, dotColor: bill.paid ? '#10B981' : '#EF4444' };
        });

        tData.forEach(task => {
          const key = new Date(task.due_date).toISOString().split('T')[0];
          calendarEvents[key] = { marked: true, dotColor: task.finished ? '#10B981' : '#3B82F6' };
        });

        aData.forEach(activity => {
          const key = new Date(activity.start_date).toISOString().split('T')[0];
          calendarEvents[key] = { marked: true, dotColor: '#8B5CF6' };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleTabChange = (route: string) => {
    setActiveTab(route);
    if (route !== 'calendar') {
      router.push(`/management/${id}/${route}`);
    }
  };

  const handleAddActivity = () => {
    router.push(`/management/${id}/create-activity`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <ScrollView className="flex-1 px-6 pt-4">
        {/* Calendar Section */}
        <View className="bg-white py-4 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold text-gray-800">Calendar</Text>
            <Pressable
              onPress={handleAddActivity}
              className="flex-row items-center bg-primary px-3 py-1 rounded-lg"
            >
              <Icon
                name={Platform.OS === 'ios' ? 'plus-circle' : 'plus'}
                size={20}
                color="white"
              />
              <Text className="text-white font-medium ml-1">Add Activity</Text>
            </Pressable>
          </View>

          <Calendar
            current={new Date().toISOString().split('T')[0]}
            onDayPress={day => console.log('Selected day', day)}
            monthFormat="MMMM yyyy"
            hideExtraDays={true}
            firstDay={1}
            markedDates={events}
            theme={{
              arrowColor: '#3B82F6',
              textMonthFontWeight: '600',
              todayTextColor: '#3B82F6',
              selectedDayBackgroundColor: '#3B82F6',
              dotColor: '#3B82F6',
            }}
          />

          {/* Legend */}
          <View className="flex-row justify-around mt-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-1" />
              <Text className="text-xs text-gray-600">Pending Bills</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
              <Text className="text-xs text-gray-600">Paid Bills</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-primary mr-1" />
              <Text className="text-xs text-gray-600">Tasks</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-purple-500 mr-1" />
              <Text className="text-xs text-gray-600">Activities</Text>
            </View>
          </View>
        </View>

        {/* Toggle Tasks / Activities */}
        <View className="flex-row justify-around mb-4">
          <Pressable
            onPress={() => setViewType('tasks')}
            className={`px-4 py-2 ${viewType === 'tasks' ? 'border-b-2 primary' : ''}`}
          >
            <Text className={`font-medium ${viewType === 'tasks' ? 'text-primary' : 'text-gray-700'}`}>
              Tasks
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewType('activities')}
            className={`px-4 py-2 ${viewType === 'activities' ? 'border-b-2 primary' : ''}`}
          >
            <Text className={`font-medium ${viewType === 'activities' ? 'text-primary' : 'text-gray-700'}`}>
              Activities
            </Text>
          </Pressable>
        </View>

        {viewType === 'tasks' ? (
          <View className="bg-white rounded-2xl border-2 border-gray-100 p-4 mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3">Upcoming Tasks</Text>
            {tasks.length === 0 ? (
              <Text className="text-gray-500">No upcoming tasks</Text>
            ) : (
              tasks.map(task => (
                <View
                  key={task.id}
                  className="flex-row justify-between items-center mb-3"
                >
                  <View>
                    <Text className="text-base text-gray-800">{task.title}</Text>
                    <Text className="text-xs text-gray-500">
                      {new Date(task.due_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Icon
                    name={task.finished ? 'check-circle' : 'clock'}
                    size={20}
                    color={task.finished ? '#10B981' : '#3B82F6'}
                  />
                </View>
              ))
            )}
          </View>
        ) : (
          <View className="bg-white rounded-2xl border-2 border-gray-100 p-4 mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3">Upcoming Activities</Text>
            {activities.length === 0 ? (
              <Text className="text-gray-500">No upcoming activities</Text>
            ) : (
              activities
                .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                .map(activity => (
                  <View
                    key={activity.id}
                    className="flex-row justify-between items-center mb-3"
                  >
                    <View>
                      <Text className="text-base text-gray-800">{activity.title}</Text>
                      <Text className="text-xs text-gray-500">
                        {new Date(activity.start_date).toLocaleString()} -{' '}
                        {new Date(activity.end_date).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Icon name="calendar" size={20} color="#8B5CF6" />
                  </View>
                ))
            )}
          </View>
        )}
      </ScrollView>

      <BottomNavigation activeTab='home' />
    </SafeAreaView>
  );
}