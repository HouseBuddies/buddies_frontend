"use client"

import Slider from "@react-native-community/slider"
import { useState } from "react"
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import EmojiSelector from "../components/EmojiSelector"

export default function PersonalityLifestyleScreen({ navigation, route }: { navigation: any; route: any }) {
  const [cleanliness, setCleanliness] = useState(3)
  const [noiseTolerance, setNoiseTolerance] = useState(3)
  const [sleepSchedule, setSleepSchedule] = useState("")
  const [pets, setPets] = useState([])
  const [smoking, setSmoking] = useState(null)
  const [alcohol, setAlcohol] = useState("")
  const [visitors, setVisitors] = useState(null)
  const [dietaryRestrictions, setDietaryRestrictions] = useState([])

  const handleNext = () => {
    // In a real app, you would validate and save the data
    const personalityLifestyle = {
      cleanliness,
      noiseTolerance,
      sleepSchedule,
      pets,
      smoking,
      alcohol,
      visitors,
      dietaryRestrictions,
    }

    navigation.navigate("Biography", {
      ...route.params,
      personalityLifestyle,
    })
  }

  const togglePet = (pet: string) => {
    if (pet === "no-pets") {
      setPets(["no-pets"])
    } else {
      setPets((prevPets) => {
        const filtered = prevPets.filter((p) => p !== "no-pets")
        return prevPets.includes(pet)
          ? filtered.filter((p) => p !== pet)
          : [...filtered, pet]
      })
    }
  }

  const toggleDietaryRestriction = (restriction: string) => {
    if (restriction === "none") {
      setDietaryRestrictions(["none"])
    } else {
      setDietaryRestrictions((prev) => {
        const filtered = prev.filter((r) => r !== "none")
        return prev.includes(restriction)
          ? filtered.filter((r) => r !== restriction)
          : [...filtered, restriction]
      })
    }
  }

  const isFormValid = sleepSchedule && (smoking != null) && alcohol && visitors

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-4">
        <Text className="text-2xl font-bold text-gray-800 mt-6 mb-8">We will try to match you with people simillar to you.</Text>

        {/* Cleanliness Level */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Cleanliness Level</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 mr-2">Relaxed</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={cleanliness}
              onValueChange={setCleanliness}
              minimumTrackTintColor="#274454"
              maximumTrackTintColor="#274454"
              thumbTintColor="#274454"
            />
            <Text className="text-gray-500 ml-2">Spotless</Text>
          </View>
          <View className="flex-row justify-between">
            <EmojiSelector
              emojis={["😌", "🙂", "😊", "😇", "✨"]}
              selectedIndex={cleanliness - 1}
              onSelect={(index) => setCleanliness(index + 1)}
            />
          </View>
        </View>

        {/* Noise Tolerance */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Noise Tolerance</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 mr-2">Silent</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={noiseTolerance}
              onValueChange={setNoiseTolerance}
              minimumTrackTintColor="#274454"
              maximumTrackTintColor="#274454"
              thumbTintColor="#274454"
            />
            <Text className="text-gray-500 ml-2">Party</Text>
          </View>
          <View className="flex-row justify-between">
            <EmojiSelector
              emojis={["🤫", "🔇", "🔉", "🔊", "🎵"]}
              selectedIndex={noiseTolerance - 1}
              onSelect={(index) => setNoiseTolerance(index + 1)}
            />
          </View>
        </View>

        {/* Sleep Schedule */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Sleep Schedule</Text>
          <ScrollView horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4">{[
              { emoji: "🌅", label: "Early Bird", value: "early_bird" },
              { emoji: "🦉", label: "Night Owl", value: "night_owl" },
              { emoji: "📊", label: "Regular", value: "regular" },
              { emoji: "🔄", label: "Variable", value: "variable" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${sleepSchedule === item.value ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setSleepSchedule(item.value)}
              >
                <Text className={`${sleepSchedule === item.value ? "text-white" : "text-gray-800"}`}>
                  {item.emoji} {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Pets */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Pets</Text>
          <ScrollView horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4">{[
              { emoji: "🐶", label: "Dog", value: "dog" },
              { emoji: "🐱", label: "Cat", value: "cat" },
              { emoji: "🐦", label: "Bird", value: "bird" },
              { emoji: "🐠", label: "Fish", value: "fish" },
              { emoji: "🐹", label: "Small Pet", value: "small_pet" },
              { emoji: "❌", label: "No Pets", value: "no_pets" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${pets.includes(item.value) ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => togglePet(item.value)}
              >
                <Text className={`${pets.includes(item.value) ? "text-white" : "text-gray-800"}`}>
                  {item.emoji} {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Smoking/Alcohol */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Smoking</Text>
          <ScrollView horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4">{[
              { emoji: "🚬", label: "Smoker", value: true },
              { emoji: "🚭", label: "Non-smoker", value: false }
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${smoking === item.value ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setSmoking(item.value)}
              >
                <Text className={`${smoking === item.value ? "text-white" : "text-gray-800"}`}>
                  {item.emoji} {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text className="text-lg font-semibold text-gray-800 mb-2 mt-4">Alcohol</Text>
          <ScrollView horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4">{[
              { emoji: "🍷", label: "Regular", value: "regular" },
              { emoji: "🥂", label: "Occasional", value: "occasional" },
              { emoji: "🚱", label: "Never", value: "never" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${alcohol === item.value ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setAlcohol(item.value)}
              >
                <Text className={`${alcohol === item.value ? "text-white" : "text-gray-800"}`}>
                  {item.emoji} {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Visitors */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Visitors</Text>
          <ScrollView horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4">{[
              { emoji: "👥", label: "Often", value: 3 },
              { emoji: "👤", label: "Sometimes", value: 2 },
              { emoji: "🧍", label: "Rarely", value: 1 },
              { emoji: "🚫", label: "Never", value: 0 },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${visitors === item.value ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setVisitors(item.value)}
              >
                <Text className={`${visitors === item.value ? "text-white" : "text-gray-800"}`}>
                  {item.emoji} {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dietary Restrictions */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Dietary Restrictions</Text>
          <ScrollView horizontal

              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
              className="mb-4">{[
              { emoji: "🥗", label: "Vegetarian", value: "vegetarian" },
              { emoji: "🌱", label: "Vegan", value: "vegan" },
              { emoji: "🍖", label: "Carnivore", value: "carnivore" },
              { emoji: "🥛", label: "Lactose-free", value: "lactose_free" },
              { emoji: "🌾", label: "Gluten-free", value: "gluten_free" },
              { emoji: "🍯", label: "Halal", value: "halal" },
              { emoji: "✡️", label: "Kosher", value: "kosher" },
              { emoji: "🚫", label: "None", value: "none" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`mr-3 mb-2 px-4 py-2 rounded-full ${dietaryRestrictions.includes(item.value) ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => toggleDietaryRestriction(item.value)}
              >
                <Text className={`${dietaryRestrictions.includes(item.value) ? "text-white" : "text-gray-800"}`}>
                  {item.emoji} {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View className="px-6 py-4 border-t border-gray-200">
      <TouchableOpacity
          className={`rounded-2xl p-5 items-center ${isFormValid ? "bg-primary" : "bg-gray-300"}`}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text className="text-white font-bold text-lg">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
