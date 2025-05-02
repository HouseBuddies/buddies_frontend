"use client"

import Slider from "@react-native-community/slider"
import { Picker } from "@react-native-picker/picker"
import { useState } from "react"
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function DemographicsScreen({ navigation, route }) {
  const [age, setAge] = useState(25)
  const [gender, setGender] = useState("")
  const [occupation, setOccupation] = useState("")
  const [incomeRange, setIncomeRange] = useState("")

  const handleNext = () => {
    // In a real app, you would validate and save the data
    navigation.navigate("LivingPreferences", {
      demographics: { age, gender, occupation, incomeRange },
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-4" keyboardShouldPersistTaps="handled">

        <Text className="text-2xl font-bold text-gray-800 mt-6 mb-8">Tell us about yourself</Text>

        {/* Age Slider */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-primary mb-2">Age: {age} years</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 mr-2">18</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={18}
              maximumValue={80}
              step={1}
              value={age}
              onValueChange={setAge}
              minimumTrackTintColor="#274454"
              maximumTrackTintColor="#274454"
              thumbTintColor="#274454"
            />
            <Text className="text-gray-500 ml-2">80</Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-xs text-gray-500">Young Adult</Text>
            <Text className="text-xs text-gray-500">Middle Age</Text>
            <Text className="text-xs text-gray-500">Senior</Text>
          </View>
        </View>

        {/* Gender Selection */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Gender (Optional)</Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden">
            <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={{ height: 50 }}>
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Non-binary" value="non-binary" />
              <Picker.Item label="Prefer not to say" value="not-specified" />
            </Picker>
          </View>
        </View>

        {/* Occupation */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Occupation</Text>
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4"
            >            {["Student", "Full-time", "Part-time", "Freelancer", "Unemployed", "Retired"].map((item) => (
              <TouchableOpacity
                key={item}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${occupation === item ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setOccupation(item)}
              >
                <Text className={`${occupation === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {occupation === "Student" && (
            <View className="mb-4">
              <Text className="text-base text-gray-700 mb-1">What are you studying?</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Enter your field of study"
              />
            </View>
          )}
        </View>

        {/* Income Range */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Income Range (for rent budget)</Text>
          <View className="border border-gray-300 rounded-lg overflow-hidden">
            <Picker
              selectedValue={incomeRange}
              onValueChange={(itemValue) => setIncomeRange(itemValue)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select income range" value="" />
              <Picker.Item label="Under $30,000" value="under-30k" />
              <Picker.Item label="$30,000 - $50,000" value="30k-50k" />
              <Picker.Item label="$50,000 - $75,000" value="50k-75k" />
              <Picker.Item label="$75,000 - $100,000" value="75k-100k" />
              <Picker.Item label="Over $100,000" value="over-100k" />
              <Picker.Item label="Prefer not to say" value="not-specified" />
            </Picker>
          </View>
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
