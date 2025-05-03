"use client"

import DateTimePicker from "@react-native-community/datetimepicker"
import Slider from "@react-native-community/slider"
import { useState } from "react"
import { Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"

export default function LivingPreferencesScreen({ navigation, route }) {
  const [maxRent, setMaxRent] = useState(1500)
  const [moveInDate, setMoveInDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [workSchedule, setWorkSchedule] = useState("")

  const handleNext = () => {
    // In a real app, you would validate and save the data
    const livingPreferences = {
      maxRent,
      moveInDate,
      workSchedule,
    }

    navigation.navigate("PersonalityLifestyle", {
      ...route.params,
      livingPreferences,
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const isFormComplete = !!workSchedule;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-4">

        <Text className="text-2xl font-bold text-gray-800 mt-6 mb-8">Now, your living preferences.</Text>

        {/* Max Monthly Rent */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Rent ({maxRent}€)</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 mr-2">500 €</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={500}
              maximumValue={3000}
              step={50}
              value={maxRent}
              onValueChange={setMaxRent}
              minimumTrackTintColor="#274454"
              maximumTrackTintColor="#274454"
              thumbTintColor="#274454"
              
            />
            <Text className="text-gray-500 ml-2">3000€ +</Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-gray-500">👛</Text>
            <Text className="text-xs text-gray-500">💳</Text>
            <Text className="text-xs text-gray-500">💸</Text>
          </View>
        </View>
        <View className="mb-8">
  <Text className="text-lg font-semibold text-gray-800 mb-2">Move-in Date</Text>

  <TouchableOpacity
    className="border border-gray-300 rounded-lg px-4 py-3 mb-2"
    onPress={() => setShowDatePicker(!showDatePicker)}
  >
    <Text>{formatDate(moveInDate)}</Text>
  </TouchableOpacity>

  {showDatePicker && (
    <DateTimePicker
      value={moveInDate}
      mode="date"
      display={Platform.OS === "ios" ? "inline" : "calendar"} // "calendar" for Android, "inline" for iOS
      minimumDate={new Date()}
      onChange={(event, selectedDate) => {
        if (selectedDate) {
          setMoveInDate(selectedDate)
        }
        if (Platform.OS !== "ios") {
          setShowDatePicker(false) // only auto-close on Android
        }
      }}
    />
  )}
</View>

        {/* Work Schedule */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Work Schedule</Text>
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4"
            >    
            {[
              { label: "🏠 Remote", value: "remote" },
              { label: "🏢 On-site", value: "on_site" },
              { label: "🌞 Day shift", value: "day_shift" },
              { label: "🌙 Night shift", value: "night_shift" },
              { label: "📅 Weekends", value: "weekends" },
              { label: "🔄 Rotating", value: "rotating" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${workSchedule === item.value ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setWorkSchedule(item.value)}
              >
                <Text className={`${workSchedule === item.value ? "text-white" : "text-gray-800"}`}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View className="px-6 py-4 border-t border-gray-200">
        <TouchableOpacity
          className={`rounded-2xl p-5 items-center ${isFormComplete ? "bg-primary" : "bg-gray-300"}`}
          onPress={handleNext}
          disabled={!isFormComplete}
        >
          <Text className="text-white font-bold text-lg">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
