import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Path } from 'react-native-svg';

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState("search")
  const router = useRouter()

      const handleTabPress = useCallback(
    (tabName: string) => {
      setActiveTab(tabName)

      // Navigate to the appropriate screen based on tab
      switch (tabName) {
        case "home":
          router.push("/home")
          break
        case "favorites":
          router.push("/")
          break
        case "messages":
          router.push("/")
          break
        case "profile":
          router.push("/")
          break
        // Search tab doesn't navigate since we're already in a search result
      }
    },
    [router],
  )

    return(
<View className="flex-row justify-between items-center p-4 border-t border-gray-200 bg-white">
  {/* Home Tab */}
  <TouchableOpacity 
    className="items-center" 
    accessibilityLabel="Home" 
    onPress={() => handleTabPress("home")}
  >
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={activeTab === "home" ? "#3B82F6" : "#6B7280"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </Svg>
    <Text className={`text-xs mt-1 ${activeTab === "home" ? "text-blue-500" : "text-gray-500"}`}>
      Home
    </Text>
  </TouchableOpacity>

  {/* Favorites Tab */}
  <TouchableOpacity
    className="items-center"
    accessibilityLabel="Favorites"
    onPress={() => handleTabPress("favorites")}
  >
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={activeTab === "favorites" ? "#3B82F6" : "#6B7280"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </Svg>
    <Text className={`text-xs mt-1 ${activeTab === "favorites" ? "text-blue-500" : "text-gray-500"}`}>
      Favorites
    </Text>
  </TouchableOpacity>

  {/* Search Tab (Circle) */}
  <TouchableOpacity 
    className="items-center" 
    accessibilityLabel="Search" 
    onPress={() => handleTabPress("search")}
  >
    <View className={`w-12 h-12 bg-blue-500 rounded-full items-center justify-center`}>
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={11} cy={11} r={8} />
        <Line x1={21} y1={21} x2={16.65} y2={16.65} />
      </Svg>
    </View>
  </TouchableOpacity>

  {/* Messages Tab */}
  <TouchableOpacity
    className="items-center"
    accessibilityLabel="Messages"
    onPress={() => handleTabPress("messages")}
  >
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={activeTab === "messages" ? "#3B82F6" : "#6B7280"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </Svg>
    <Text className={`text-xs mt-1 ${activeTab === "messages" ? "text-blue-500" : "text-gray-500"}`}>
      Messages
    </Text>
  </TouchableOpacity>

  {/* Profile Tab */}
  <TouchableOpacity
    className="items-center"
    accessibilityLabel="Profile"
    onPress={() => handleTabPress("profile")}
  >
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={activeTab === "profile" ? "#3B82F6" : "#6B7280"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx={12} cy={7} r={4} />
    </Svg>
    <Text className={`text-xs mt-1 ${activeTab === "profile" ? "text-blue-500" : "text-gray-500"}`}>
      Profile
    </Text>
  </TouchableOpacity>
</View>
    )
}  

export default BottomNavigation;