"use client"

import { useAuth } from "@/context/AuthContext"
import { fetchUserInfo } from "@/data/auth/auth"
import { createHouseTask } from "@/data/houses"
import DateTimePicker from "@react-native-community/datetimepicker"
import Checkbox from "expo-checkbox"
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

interface TaskForm {
    title: string
    description: string
    dueDate: Date
    finished: boolean
}

export default function CreateTodo() {
    const { id } = useLocalSearchParams()
    const { token } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    // Form state
    const [form, setForm] = useState<TaskForm>({
        title: "",
        description: "",
        dueDate: new Date(new Date().setHours(23, 59, 59, 999)), // Default to end of today
        finished: false,
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
        dueDate: "",
    })

    // Date picker visibility state
    const [showDatePicker, setShowDatePicker] = useState(false)

    const validateForm = (): boolean => {
        let isValid = true
        const newErrors = {
            title: "",
            dueDate: "",
        }

        if (!form.title.trim()) {
            newErrors.title = "Title is required"
            isValid = false
        }

        if (form.dueDate < new Date()) {
            newErrors.dueDate = "Due date cannot be in the past"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || form.dueDate
        setShowDatePicker(Platform.OS === "ios")

        // Set time to end of day for the selected date
        const endOfDay = new Date(currentDate)
        endOfDay.setHours(23, 59, 59, 999)

        setForm({
            ...form,
            dueDate: endOfDay,
        })
    }

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            const response = await createHouseTask(
                id as string,
                user.id,
                {
                    title: form.title,
                    description: form.description,
                    due_date: form.dueDate.toISOString(),
                    finished: form.finished,
                },
                token,
            )

            if (!response) {
                throw new Error("Failed to create task")
            }

            Alert.alert("Success", "Task has been created successfully", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ])
        } catch (error) {
            Alert.alert("Error", "Failed to create task. Please try again.")
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
                            <Text className="text-xl font-bold text-gray-800 ml-3">Create Task</Text>
                        </View>
                    </View>

                    {/* Form */}
                    <View className="px-6 py-6">
                        {/* Title Field */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Icon name="check-square" size={16} color="#4B5563" />
                                <Text className="text-gray-700 font-medium ml-2">Task Title</Text>
                                {errors.title ? <Text className="text-red-500 text-xs ml-auto">{errors.title}</Text> : null}
                            </View>
                            <TextInput
                                className={`border ${errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                                    } rounded-xl px-4 py-3.5 text-base`}
                                placeholder="What needs to be done?"
                                value={form.title}
                                onChangeText={(text) => setForm({ ...form, title: text })}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        {/* Description Field */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Icon name="align-left" size={16} color="#4B5563" />
                                <Text className="text-gray-700 font-medium ml-2">Description (Optional)</Text>
                            </View>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3.5 text-base"
                                placeholder="Add details about this task"
                                value={form.description}
                                onChangeText={(text) => setForm({ ...form, description: text })}
                                multiline
                                numberOfLines={3}
                                style={{ height: 100, textAlignVertical: "top" }}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        {/* Due Date Field */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-2">
                                <Icon name="calendar" size={16} color="#4B5563" />
                                <Text className="text-gray-700 font-medium ml-2">Due Date</Text>
                                {errors.dueDate ? <Text className="text-red-500 text-xs ml-auto">{errors.dueDate}</Text> : null}
                            </View>

                            <Pressable
                                onPress={() => setShowDatePicker(true)}
                                className="flex-row items-center justify-between bg-white rounded-xl border border-gray-300 px-4 py-4"
                            >
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
                                        <Icon name="calendar" size={18} color="#4F46E5" />
                                    </View>
                                    <Text className="text-gray-800">{formatDate(form.dueDate)}</Text>
                                </View>
                                <Icon name="chevron-down" size={20} color="#6B7280" />
                            </Pressable>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={form.dueDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                    minimumDate={new Date()}
                                />
                            )}
                        </View>


                        {/* Task Status */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-3">
                                <Icon name="check-circle" size={16} color="#4B5563" />
                                <Text className="text-gray-700 font-medium ml-2">Status</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => setForm({ ...form, finished: !form.finished })}
                                className="flex-row items-center bg-white rounded-xl border border-gray-300 px-4 py-4"
                            >
                                <Checkbox
                                    value={form.finished}
                                    onValueChange={(value) => setForm({ ...form, finished: value })}
                                    color={form.finished ? "#4F46E5" : undefined}
                                    className="mr-3"
                                />
                                <Text className={`${form.finished ? "line-through text-gray-400" : "text-gray-800"}`}>
                                    {form.finished ? "Completed" : "Mark as completed"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button (for bottom of form) */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            className={`${isSubmitting ? "bg-indigo-400" : "bg-indigo-600"} rounded-xl py-4 mb-10 shadow-sm`}
                        >
                            {isSubmitting ? (
                                <View className="flex-row items-center justify-center">
                                    <ActivityIndicator color="white" size="small" />
                                    <Text className="text-white font-medium ml-2">Creating...</Text>
                                </View>
                            ) : (
                                <Text className="text-white font-medium text-center text-base">Create Task</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
