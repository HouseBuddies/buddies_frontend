import { useAuth } from "@/context/AuthContext";
import { updateUserPreferences } from "@/data/users";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SummaryScreen({ navigation, route }) {
  const { demographics, livingPreferences, personalityLifestyle } = route.params
  const { token } = useAuth()

  async function sendPreferences() {
    const rawData = {
      ...demographics,
      ...livingPreferences,
      ...personalityLifestyle
    };
  
    const keyMap = {
      age: "age",
      alcohol: "alcohol",
      cleanliness: "desired_cleanliness",
      dietaryRestrictions: "dietary_restrictions",
      gender: "gender",
      incomeRange: "income_range",
      maxRent: "max_rent",
      moveInDate: "move_in_date",
      neighborhood: "location",
      noiseTolerance: "noise_tolerance",
      occupation: "occupation",
      pets: "pets",
      sleepSchedule: "sleep_schedule",
      smoking: "smoker",
      visitors: "visitors",
      workSchedule: "work_schedule"
    };
  
    const data = Object.entries(rawData).reduce((acc, [key, value]) => {
      const backendKey = keyMap[key];
      if (backendKey) {
        acc[backendKey] = value;
      }
      return acc;
    }, {});

    console.log(data)
  
    await updateUserPreferences(token || "", data);
  }

  const formatDate = (date : any) => {
    if (!date) return "Not specified"
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  function formatName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).replace("_", " ")
  }

  const renderSection = (title, items) => (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-3">{title}</Text>
      <View className="bg-gray-50 rounded-lg p-4">
        {items.map((item, index) => (
          <View key={index} className="flex-row py-2 border-b border-gray-200 last:border-b-0">
            <Text className="text-gray-600 w-1/3">{item.label} </Text>
            <Text className="text-gray-900 font-medium flex-1">{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  )

  const demographicsItems = [
    { label: "Age", value: demographics?.age || "Not specified" },
    { label: "Gender", value: formatName(demographics?.gender) || "Not specified" },
    { label: "Occupation", value: formatName(demographics?.occupation) || "Not specified" },
  ]

  const livingPreferencesItems = [
    { label: "Max Rent", value: livingPreferences?.maxRent ? `${livingPreferences.maxRent} €` : "Not specified" },
    { label: "Move-in Date", value: formatDate(livingPreferences?.moveInDate) },
    { label: "Work Schedule", value: formatName(livingPreferences?.workSchedule) || "Not specified" },
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
    { label: "Sleep Schedule", value: formatName(personalityLifestyle?.sleepSchedule) || "Not specified" },
    {
      label: "Pets",
      value: personalityLifestyle?.pets?.length
        ? personalityLifestyle.pets.map((e) => e.charAt(0).toUpperCase() + e.slice(1).replace("-", " ")).join(", ")
        : "None"
    },
    { label: "Smoking", value: personalityLifestyle?.smoker ? "Yes" : "No" },
    {
      label: "Alcohol",
      value: personalityLifestyle?.alcohol
        ? formatName(personalityLifestyle.alcohol)
        : "Not specified"
    },
    { label: "Visitors", value: ["Often", "Sometimes", "Rarely", "Never"][personalityLifestyle?.visitors] || "Not specified" },
    {
      label: "Dietary Restrictions",
      value: personalityLifestyle?.dietaryRestrictions?.length
        ? personalityLifestyle.dietaryRestrictions.map((e) => formatName(e)).join(", ")
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
      </ScrollView>

      <View className="px-6 py-4 border-t border-gray-200">
      <TouchableOpacity
          className={`rounded-2xl p-5 items-center bg-primary`}
          onPress={() => sendPreferences().then(router.push("/home"))}
        >
          <Text className="text-white font-bold text-lg">Let's do this!  🎉</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}