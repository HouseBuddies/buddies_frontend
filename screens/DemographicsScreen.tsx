"use client"

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

  const isFormComplete = age >= 18 && !!gender && !!occupation;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-4" keyboardShouldPersistTaps="handled">

        <Text className="text-2xl font-bold text-gray-800 mt-6 mb-8">Firstly, tell us about yourself.</Text>

        {/* Age Slider */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-primary mb-2">Age</Text>
          <TextInput
            className="border border-gray-300 rounded-lg pt-2 pb-4 px-4 text-lg"
            keyboardType="numeric"
            value={age.toString()}
            onChangeText={(text) => {
              const numeric = parseInt(text)
              setAge(isNaN(numeric) ? 0 : numeric)
            }}
            placeholder="Enter your age"
            maxLength={2}
          />
        </View>

        {/* Gender Selection */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Gender</Text>
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4">{[{ label: "Female", value: "female" },
                { label: "Male", value: "male" },
                { label: "Non Binary", value: "non_binary" },
                { label: "Prefer not to say", value: "not_say" }].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${gender === item.value ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setGender(item.value)}
              >
                <Text className={`${gender === item.value ? "text-white" : "text-gray-800"}`}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Occupation */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Occupation</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            className="mb-4"
          >
            {[
              { label: "Student 🎓", value: "student" },
              { label: "Full-time 💼", value: "full-time" },
              { label: "Part-time ⏰", value: "part-time" },
              { label: "Freelancer 🧑‍💻", value: "freelancer" },
              { label: "Unemployed 🚫", value: "unemployed" },
              { label: "Retired 🧓", value: "retired" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${occupation === item.value ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setOccupation(item.value)}
              >
                <Text className={`${occupation === item.value ? "text-white" : "text-gray-800"}`}>
                  {item.label}
                </Text>
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
