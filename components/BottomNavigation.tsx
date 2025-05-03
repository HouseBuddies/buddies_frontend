import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface TabConfig {
  name: string;
  route: string;
  Icon: React.FC<{ color: string }>;
  label: string;
}

const tabs: TabConfig[] = [
  {
    name: 'home', route: '/management', Icon: ({ color }) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Rect x={3} y={3} width={7} height={7} />
        <Rect x={14} y={3} width={7} height={7} />
        <Rect x={14} y={14} width={7} height={7} />
        <Rect x={3} y={14} width={7} height={7} />
      </Svg>
    ), label: 'Manager',
  },
  {
    name: 'favorites', route: '/favorites', Icon: ({ color }) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </Svg>
    ), label: 'Favorites',
  },
  {
    name: 'search', route: '/home', Icon: ({ color }) => (
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={11} cy={11} r={8} />
        <Line x1={21} y1={21} x2={16.65} y2={16.65} />
      </Svg>
    ), label: 'Search',
  },
  {
    name: 'messages', route: '/', Icon: ({ color }) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </Svg>
    ), label: 'Messages',
  },
  {
    name: 'profile', route: '/profile', Icon: ({ color }) => (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <Circle cx={12} cy={7} r={4} />
      </Svg>
    ), label: 'Profile',
  },
];

interface Props {
  activeTab: string;
}

export default function BottomNavigation({ activeTab }: Props) {
  const router = useRouter();

  const handleTabPress = useCallback(
    (route: string) => router.replace(route),
    [router],
  );

  return (
    <View className="w-full flex-row justify-between items-center p-4 pb-10 border-t border-gray-200 bg-white">
      {tabs.map(tab => {
        // Compare prop activeTab to tab.name exactly
        const color = tab.name === activeTab ? '#3B82F6' : '#6B7280';
        return (
          <TouchableOpacity
            key={tab.name}
            className="items-center"
            accessibilityLabel={tab.label}
            onPress={() => handleTabPress(tab.route)}
          >
            {/* Icon color changed based on prop */}
            <tab.Icon color={color} />
            <Text className="text-xs mt-1" style={{ color }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
