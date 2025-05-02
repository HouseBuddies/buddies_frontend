import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from 'react-native-svg';


const NavItem = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void }) => {
    return (
        <TouchableOpacity
            className={`items-center px-4 ${isActive ? 'border-b-2 border-blue-500' : 'opacity-70'}`}
            onPress={onPress}
        >
            <View className="items-center" accessibilityLabel="Home">
                <Svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isActive ? '#3B82F6' : '#6B7280'}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </Svg>
            </View>
            <Text className={`text-xs mt-1 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>{title}</Text>
        </TouchableOpacity>
    );
};

const TopNavigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) => {
    const tabs = [
        { id: 'home', title: 'Home', route: '/management/1/home' },
        { id: 'todo-list', title: 'To Do', route: '/management/1/todo-list' },
        { id: 'bills', title: 'Bills', route: '/management/1/bills' },
        { id: 'shopping', title: 'Shopping List', route: '/management/1/shopping-list' },
        { id: 'calendar', title: 'Calendar', route: '/management/1/calendar' },
    ];

    console.log("activeTab", activeTab);

    return (
        <View className="w-full flex-row justify-between items-center px-2 pt-1 pb-2 bg-white">
            {tabs.map((tab) => (
                <NavItem
                    key={tab.id}
                    title={tab.title}
                    isActive={activeTab === tab.id}
                    onPress={() => onTabChange(tab.id)}
                />
            ))}
        </View>
    );
};

export default TopNavigation;