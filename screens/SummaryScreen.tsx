import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"

export default function SummaryScreen({ navigation, route }) {
  const { demographics, livingPreferences, personalityLifestyle } = route.params

  const formatDate = (date : any) => {
    if (!date) return "Not specified"
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const renderSection = (title, items) => (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-3">{title}</Text>
      <View className="bg-gray-50 rounded-lg p-4">
        {items.map((item, index) => (
          <View key={index} className="flex-row py-2 border-b border-gray-200 last:border-b-0">
            <Text className="text-gray-600 w-1/3">{item.label}</Text>
            <Text className="text-gray-900 font-medium flex-1">{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  )

  const demographicsItems = [
    { label: "Age", value: demographics?.age || "Not specified" },
    { label: "Gender", value: demographics?.gender || "Not specified" },
    { label: "Occupation", value: demographics?.occupation || "Not specified" },
    { label: "Income Range", value: demographics?.incomeRange || "Not specified" },
  ]

  const livingPreferencesItems = [
    { label: "Neighborhood", value: livingPreferences?.neighborhood || "Not specified" },
    { label: "Max Rent", value: livingPreferences?.maxRent ? `$${livingPreferences.maxRent}` : "Not specified" },
    { label: "Lease Length", value: livingPreferences?.leaseLength || "Not specified" },
    { label: "Move-in Date", value: formatDate(livingPreferences?.moveInDate) },
    { label: "Work Schedule", value: livingPreferences?.workSchedule || "Not specified" },
  ]

  const personalityItems = [
    {
      label: "Cleanliness",
      value: personalityLifestyle?.cleanliness ? `${personalityLifestyle.cleanliness}/5` : "Not specified",
    },
    {
      label: "Noise Tolerance",
      value: personalityLifestyle?.noiseTolerance ? `${personalityLifestyle.noiseTolerance}/5` : "Not specified",
    },
    { label: "Sleep Schedule", value: personalityLifestyle?.sleepSchedule || "Not specified" },
    { label: "Pets", value: personalityLifestyle?.pets?.length ? personalityLifestyle.pets.join(", ") : "None" },
    { label: "Smoking", value: personalityLifestyle?.smoking || "Not specified" },
    { label: "Alcohol", value: personalityLifestyle?.alcohol || "Not specified" },
    { label: "Visitors", value: personalityLifestyle?.visitors || "Not specified" },
    {
      label: "Dietary Restrictions",
      value: personalityLifestyle?.dietaryRestrictions?.length
        ? personalityLifestyle.dietaryRestrictions.join(", ")
        : "None",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-4">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4">
            <Text className="text-4xl">🏠</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">Profile Summary</Text>
          <Text className="text-gray-600">Your roommate preferences</Text>
        </View>

        {renderSection("Basic Demographics", demographicsItems)}
        {renderSection("Living Preferences", livingPreferencesItems)}
        {renderSection("Personality & Lifestyle", personalityItems)}

        <View className="mb-8 mt-4 bg-blue-50 p-4 rounded-lg">
          <Text className="text-blue-800 font-medium">
            Your profile is ready! In a real app, we would now match you with compatible roommates based on your
            preferences.
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 py-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg items-center"
          onPress={() => navigation.navigate("Welcome")}
        >
          <Text className="text-white font-bold text-lg">Start Over</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
