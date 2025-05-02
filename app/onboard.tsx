import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"

import DemographicsScreen from "@/screens/DemographicsScreen"
import LivingPreferencesScreen from "@/screens/LivingPreferencesScreen"
import PersonalityLifestyleScreen from "@/screens/PersonalityLifestyleScreen"
import SummaryScreen from "@/screens/SummaryScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Demographics" component={DemographicsScreen} />
        <Stack.Screen
          name="LivingPreferences"
          component={LivingPreferencesScreen}
        />
        <Stack.Screen
          name="PersonalityLifestyle"
          component={PersonalityLifestyleScreen}
          options={{ title: "Personality & Lifestyle" }}
        />
        <Stack.Screen name="Summary" component={SummaryScreen} options={{ title: "Your Profile Summary" }} />
      </Stack.Navigator>
    </>
  )
}

function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-4xl font-bold text-center text-blue-600 mb-2">🏠 Roommate Matcher</Text>
        <Text className="text-xl text-center text-gray-700 mb-8">Find your perfect roommate match!</Text>

        <View className="w-full space-y-4 mb-8">
          <View className="flex-row items-center">
            <Text className="text-3xl mr-4">📋</Text>
            <View>
              <Text className="text-lg font-semibold text-gray-800">Basic Demographics</Text>
              <Text className="text-gray-600">Age, gender, occupation, income</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <Text className="text-3xl mr-4">🏙️</Text>
            <View>
              <Text className="text-lg font-semibold text-gray-800">Living Preferences</Text>
              <Text className="text-gray-600">Location, budget, lease terms</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <Text className="text-3xl mr-4">🧠</Text>
            <View>
              <Text className="text-lg font-semibold text-gray-800">Personality & Lifestyle</Text>
              <Text className="text-gray-600">Habits, preferences, compatibility factors</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-4 px-8 rounded-full w-full items-center"
          onPress={() => navigation.navigate("Demographics")}
        >
          <Text className="text-white font-bold text-lg">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
