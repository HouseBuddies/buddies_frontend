"use client"

import { useAuth } from "@/context/AuthContext"
import { fetchUserInfo } from "@/data"
import { createHouseProduct } from "@/data/houses"
import { router, useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useState } from "react"
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

interface ProductForm {
  name: string
  quantity: number
  description?: string
}

export default function CreateProduct() {
  const { id } = useLocalSearchParams()
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; photo?: string } | null>(null)

  const [form, setForm] = useState<ProductForm>({
    name: "",
    quantity: 1,
    description: "",
  })

  const [errors, setErrors] = useState({ name: "", quantity: "" })
  const [showDatePicker, setShowDatePicker] = useState(false)

  const validateForm = (): boolean => {
    const newErrors = { name: "", quantity: "" }
    let valid = true
    if (!form.name.trim()) {
      newErrors.name = "Product name is required"
      valid = false
    }
    if (form.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1"
      valid = false
    }
    setErrors(newErrors)
    return valid
  }

  const fetchUserData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetchUserInfo(token);
      if (response?.user) {
        setUser(response.user);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const handleDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selected) setForm({ ...form })
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  const handleSubmit = async () => {
    if (!validateForm() || !id || !token) return
    setIsSubmitting(true)
    try {
      const payload = {
        name: form.name,
        quantity: form.quantity,
        description: form.description,
        created_by: user?.id,
      }
      const res = await createHouseProduct(id as string, payload, token as string)
      if (!res) throw new Error("Failed to create product")

      Alert.alert(
        "Success",
        "Product has been created successfully.",
        [{ text: "OK", onPress: () => router.push(`/management/${id}/shopping`) }]
      )
    } catch (e) {
      console.error(e)
      Alert.alert("Error", "Could not create product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <Pressable onPress={() => router.back()} className="p-2">
              <Icon name="arrow-left" size={20} color="#374151" />
            </Pressable>
            <Text className="text-xl font-bold text-gray-800">Create Product</Text>
            <View style={{ width: 32 }} />
          </View>

          <View className="px-6 py-6">
            {/* Name */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Icon name="tag" size={16} color="#4B5563" />
                <Text className="ml-2 text-gray-700 font-medium">Name</Text>
                {errors.name ? (
                  <Text className="text-red-500 text-xs ml-auto">{errors.name}</Text>
                ) : null}
              </View>
              <TextInput
                className={`border px-4 py-3 rounded-xl text-base ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Eg. Milk"
                value={form.name}
                onChangeText={text => setForm({ ...form, name: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Quantity */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Icon name="hash" size={16} color="#4B5563" />
                <Text className="ml-2 text-gray-700 font-medium">Quantity</Text>
                {errors.quantity ? (
                  <Text className="text-red-500 text-xs ml-auto">{errors.quantity}</Text>
                ) : null}
              </View>
              <TextInput
                className={`border px-4 py-3 rounded-xl text-base ${errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                keyboardType="number-pad"
                value={String(form.quantity)}
                onChangeText={val => setForm({ ...form, quantity: Number(val) })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Note */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Icon name="edit-2" size={16} color="#4B5563" />
                <Text className="ml-2 text-gray-700 font-medium">Note (Optional)</Text>
              </View>
              <TextInput
                className="border border-gray-300 px-4 py-3 rounded-xl text-base"
                placeholder="Any extra details"
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: 'top' }}
                value={form.description}
                onChangeText={text => setForm({ ...form, description: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'} rounded-xl py-4 mb-10 shadow-md`}
            >
              {isSubmitting ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-medium ml-2">Creating...</Text>
                </View>
              ) : (
                <Text className="text-white font-medium text-center text-base">Create Product</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
