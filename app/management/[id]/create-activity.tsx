"use client"

import { useAuth } from "@/context/AuthContext"
import { fetchUserInfo } from "@/data/auth/auth"
import { createHouseActivity } from "@/data/houses"
import DateTimePicker from "@react-native-community/datetimepicker"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"

interface ActivityForm {
  title: string
  description: string
  startDate: Date
  endDate: Date
}

export default function CreateActivity() {
  const { id } = useLocalSearchParams()
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null) // Replace 'any' with your user type

  // Form state
  const [form, setForm] = useState<ActivityForm>({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // Default to 1 hour later
  })


  useEffect(() => {
    let isMounted = true;
  
    const getUserData = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const userData = await fetchUserInfo(token);
        
        // Only update state if component is still mounted
        if (isMounted && userData?.user) {
          setUser(userData.user);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching user data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    getUserData();
  
    return () => {
      isMounted = false; // cleanup
    };
  }, [token]);

  // Validation state
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    dates: "",
  })

  // Date picker visibility state
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date")

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = {
      title: "",
      description: "",
      dates: "",
    }

    if (!form.title.trim()) {
      newErrors.title = "Title is required"
      isValid = false
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required"
      isValid = false
    }

    if (form.endDate <= form.startDate) {
      newErrors.dates = "End time must be after start time"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || form.startDate
    setShowStartPicker(Platform.OS === "ios")

    // If end date is before new start date, adjust end date
    let newEndDate = form.endDate
    if (form.endDate <= currentDate) {
      newEndDate = new Date(currentDate.getTime() + 60 * 60 * 1000) // 1 hour later
    }

    setForm({
      ...form,
      startDate: currentDate,
      endDate: newEndDate,
    })
  }

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || form.endDate
    setShowEndPicker(Platform.OS === "ios")
    setForm({
      ...form,
      endDate: currentDate,
    })
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const showDatePicker = (type: "start" | "end", mode: "date" | "time") => {
    setPickerMode(mode)
    if (type === "start") {
      setShowStartPicker(true)
    } else {
      setShowEndPicker(true)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await createHouseActivity(
        id as string,
        user.id,
        {
          title: form.title,
          description: form.description,
          start_date: form.startDate.toISOString(),
          end_date: form.endDate.toISOString(),
        },
        token,
      )

      if (!response) {
        throw new Error("Failed to create activity")
      }

      Alert.alert("Success", "Activity has been created successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to create activity. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1">
          {/* Header with back button */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full items-center justify-center bg-gray-100"
              >
                <Icon name="arrow-left" size={20} color="#374151" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-800 ml-3">Create Activity</Text>
            </View>
          </View>

          {/* Form */}
          <View className="px-6 py-6">
            {/* Title Field */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Icon name="edit-3" size={16} color="#4B5563" />
                <Text className="text-gray-700 font-medium ml-2">Title</Text>
                {errors.title ? <Text className="text-red-500 text-xs ml-auto">{errors.title}</Text> : null}
              </View>
              <TextInput
                className={`border ${
                  errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-xl px-4 py-3.5 text-base`}
                placeholder="Enter activity title"
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description Field */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Icon name="align-left" size={16} color="#4B5563" />
                <Text className="text-gray-700 font-medium ml-2">Description</Text>
                {errors.description ? <Text className="text-red-500 text-xs ml-auto">{errors.description}</Text> : null}
              </View>
              <TextInput
                className={`border ${
                  errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-xl px-4 py-3.5 text-base`}
                placeholder="Enter activity description"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                multiline
                numberOfLines={4}
                style={{ height: 120, textAlignVertical: "top" }}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Date and Time Fields */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Icon name="calendar" size={16} color="#4B5563" />
                <Text className="text-gray-700 font-medium ml-2">Date and Time</Text>
                {errors.dates ? <Text className="text-red-500 text-xs ml-auto">{errors.dates}</Text> : null}
              </View>

              {/* Start Date/Time Card */}
              <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <Text className="text-gray-500 text-sm mb-3">Start</Text>
                <View className="flex-row justify-between">
                  <Pressable
                    onPress={() => showDatePicker("start", "date")}
                    className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 flex-1 mr-2"
                  >
                    <Icon name="calendar" size={16} color="#4B5563" />
                    <Text className="ml-2 text-gray-800">{formatDate(form.startDate)}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => showDatePicker("start", "time")}
                    className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 flex-1"
                  >
                    <Icon name="clock" size={16} color="#4B5563" />
                    <Text className="ml-2 text-gray-800">{formatTime(form.startDate)}</Text>
                  </Pressable>
                </View>
              </View>

              {/* End Date/Time Card */}
              <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <Text className="text-gray-500 text-sm mb-3">End</Text>
                <View className="flex-row justify-between">
                  <Pressable
                    onPress={() => showDatePicker("end", "date")}
                    className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 flex-1 mr-2"
                  >
                    <Icon name="calendar" size={16} color="#4B5563" />
                    <Text className="ml-2 text-gray-800">{formatDate(form.endDate)}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => showDatePicker("end", "time")}
                    className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 flex-1"
                  >
                    <Icon name="clock" size={16} color="#4B5563" />
                    <Text className="ml-2 text-gray-800">{formatTime(form.endDate)}</Text>
                  </Pressable>
                </View>
              </View>

              {/* Date Time Pickers (hidden by default) */}
              {showStartPicker && (
                <DateTimePicker
                  value={form.startDate}
                  mode={pickerMode}
                  display="default"
                  onChange={handleStartDateChange}
                  minimumDate={new Date()}
                />
              )}
              {showEndPicker && (
                <DateTimePicker
                  value={form.endDate}
                  mode={pickerMode}
                  display="default"
                  onChange={handleEndDateChange}
                  minimumDate={form.startDate}
                />
              )}
            </View>

            {/* Optional Fields Section */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-4">Additional Options</Text>

              {/* Location Field (Optional) */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 border-b border-gray-200"
                onPress={() => Alert.alert("Coming Soon", "Location selection will be available soon.")}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                    <Icon name="map-pin" size={18} color="#3B82F6" />
                  </View>
                  <Text className="text-gray-800 ml-3">Add Location</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Attendees Field (Optional) */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 border-b border-gray-200"
                onPress={() => Alert.alert("Coming Soon", "Attendee selection will be available soon.")}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center">
                    <Icon name="users" size={18} color="#8B5CF6" />
                  </View>
                  <Text className="text-gray-800 ml-3">Add Attendees</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Reminder Field (Optional) */}
              <TouchableOpacity
                className="flex-row items-center justify-between py-4 border-b border-gray-200"
                onPress={() => Alert.alert("Coming Soon", "Reminder settings will be available soon.")}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center">
                    <Icon name="bell" size={18} color="#F59E0B" />
                  </View>
                  <Text className="text-gray-800 ml-3">Set Reminder</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Submit Button (for bottom of form) */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-blue-400" : "bg-blue-600"} rounded-xl py-4 mb-10 shadow-sm`}
            >
              {isSubmitting ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-medium ml-2">Creating...</Text>
                </View>
              ) : (
                <Text className="text-white font-medium text-center text-base">Create Activity</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
