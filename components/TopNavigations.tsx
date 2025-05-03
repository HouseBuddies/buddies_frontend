import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from 'react-native-svg';

// SVG path data for different icons
const iconPaths = {
  home: {
    d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
    viewBox: "0 0 24 24"
  },
  todo: {
    d: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    viewBox: "0 0 24 24"
  },
  bills: {
    d: "M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zm-10 9h4m-4-4h1m-1 8h7M8 9h1",
    viewBox: "0 0 24 24"
  },
  shopping: {
    d: "M9 20a1 1 0 11-2 0 1 1 0 012 0zm9 0a1 1 0 11-2 0 1 1 0 012 0zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6",
    viewBox: "0 0 24 24"
  },
  calendar: {
    d: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 5H5M16 2v4M8 2v4",
    viewBox: "0 0 24 24"
  }
};

const NavItem = ({
  title,
  isActive,
  onPress,
  iconType
}: {
  title: string;
  isActive: boolean;
  onPress: () => void;
  iconType: keyof typeof iconPaths;
}) => {
  const iconPath = iconPaths[iconType];
  
  return (
    <TouchableOpacity
      className={`items-center px-4 mb-2`}
      onPress={onPress}
      accessibilityLabel={title}
    >
      <View className="items-center">
        <Svg
          width={24}
          height={24}
          viewBox={iconPath.viewBox}
          fill="none"
          stroke={isActive ? '#3B82F6' : '#6B7280'}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d={iconPath.d} />
        </Svg>
      </View>
      <Text className={`text-sm ${isActive ? 'text-primary' : 'text-gray-500'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const TopNavigation = ({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: string; 
  onTabChange: (id: string) => void 
}) => {
  const tabs = [
    { id: 'home', title: 'Home', route: '/management/1/home', iconType: 'home' as const },
    { id: 'todo-list', title: 'To Do', route: '/management/1/todo-list', iconType: 'todo' as const },
    { id: 'bills', title: 'Bills', route: '/management/1/bills', iconType: 'bills' as const },
    { id: 'shopping', title: 'Shopping List', route: '/management/1/shopping-list', iconType: 'shopping' as const },
    { id: 'calendar', title: 'Calendar', route: '/management/1/calendar', iconType: 'calendar' as const },
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
          iconType={tab.iconType}
        />
      ))}
    </View>
  );
};

export default TopNavigation;