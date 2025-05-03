import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

// Icon Paths
const iconPaths = {
  home: { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", viewBox: "0 0 24 24" },
  todo: { d: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11", viewBox: "0 0 24 24" },
  bills: { d: "M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zm-10 9h4m-4-4h1m-1 8h7M8 9h1", viewBox: "0 0 24 24" },
  shopping: { d: "M9 20a1 1 0 11-2 0 1 1 0 012 0zm9 0a1 1 0 11-2 0 1 1 0 012 0zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6", viewBox: "0 0 24 24" },
  calendar: { d: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 5H5M16 2v4M8 2v4", viewBox: "0 0 24 24" },
} as const;

type IconType = keyof typeof iconPaths;

const NavItem = memo(({ title, isActive, onPress, iconType }: {
  title: string;
  isActive: boolean;
  onPress: () => void;
  iconType: IconType;
}) => {
  const { d, viewBox } = iconPaths[iconType];

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={title}
      className="items-center px-4 mb-2"
    >
      <View className="items-center">
        <Svg
          width={24}
          height={24}
          viewBox={viewBox}
          fill="none"
          stroke={isActive ? '#3B82F6' : '#6B7280'}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d={d} />
        </Svg>
      </View>
      <Text className={`text-sm`} style={{ color: isActive ? '#3B82F6' : '#6B7280' }}>
        {title}
      </Text>
    </Pressable>
  );
});

const tabItems = [
  { id: 'home', title: 'Home', iconType: 'home' },
  { id: 'todo-list', title: 'To Do', iconType: 'todo' },
  { id: 'bills', title: 'Bills', iconType: 'bills' },
  { id: 'shopping', title: 'Shop', iconType: 'shopping' },
  { id: 'calendar', title: 'Calendar', iconType: 'calendar' },
] as const;


const TopNavigation = ({
  activeTab,
  onTabChange
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) => {
  return (
    <View className="w-full flex-row justify-between items-center px-2 pt-1 pb-2 bg-white border-b-2 border-gray-200 mt-4">
      {tabItems.map(({ id, title, iconType }) => (
        <NavItem
          key={id}
          title={title}
          isActive={activeTab === id}
          onPress={() => onTabChange(id)}
          iconType={iconType}
        />
      ))}
    </View>
  );
};

export default TopNavigation;