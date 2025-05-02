"use client"

import DateTimePicker from "@react-native-community/datetimepicker"
import Slider from "@react-native-community/slider"
import { Picker } from "@react-native-picker/picker"
import { useState } from "react"
import { Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function LivingPreferencesScreen({ navigation, route }) {
  const [neighborhood, setNeighborhood] = useState("")
  const [maxRent, setMaxRent] = useState(1500)
  const [leaseLength, setLeaseLength] = useState("")
  const [moveInDate, setMoveInDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [workSchedule, setWorkSchedule] = useState("")

  const handleNext = () => {
    // In a real app, you would validate and save the data
    const livingPreferences = {
      neighborhood,
      maxRent,
      leaseLength,
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-4">

        <Text className="text-2xl font-bold text-gray-800 mt-6 mb-8">Your Living Preferences</Text>

        {/* Preferred Neighborhood */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Preferred Neighborhood or City</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Enter neighborhood or city"
            value={neighborhood}
            onChangeText={setNeighborhood}
          />
        </View>

        {/* Max Monthly Rent */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Max Monthly Rent: ${maxRent}</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 mr-2">$500</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={500}
              maximumValue={5000}
              step={50}
              value={maxRent}
              onValueChange={setMaxRent}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#e2e8f0"
              thumbTintColor="#3b82f6"
            />
            <Text className="text-gray-500 ml-2">$5000+</Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-gray-500">Budget</Text>
            <Text className="text-xs text-gray-500">Mid-range</Text>
            <Text className="text-xs text-gray-500">Luxury</Text>
          </View>
        </View>

        {/* Preferred Lease Length */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Preferred Lease Length</Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden">
            <Picker
              selectedValue={leaseLength}
              onValueChange={(itemValue) => setLeaseLength(itemValue)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select lease length" value="" />
              <Picker.Item label="Month-to-month" value="month-to-month" />
              <Picker.Item label="3 months" value="3-months" />
              <Picker.Item label="6 months" value="6-months" />
              <Picker.Item label="1 year" value="1-year" />
              <Picker.Item label="1+ year" value="more-than-1-year" />
              <Picker.Item label="Flexible" value="flexible" />
            </Picker>
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
              { label: "🏢 On-site", value: "on-site" },
              { label: "🌞 Day shift", value: "day-shift" },
              { label: "🌙 Night shift", value: "night-shift" },
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
        <TouchableOpacity className="bg-blue-600 py-4 rounded-lg items-center" onPress={handleNext}>
          <Text className="text-white font-bold text-lg">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
