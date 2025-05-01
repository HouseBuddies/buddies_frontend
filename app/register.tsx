import { Alert, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import CheckBox from '@react-native-community/checkbox';

import { Link } from "expo-router";
import { useState } from "react";

const RegisterPage = () => {
    const [isSelected, setSelection] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const register = async () => {
        setIsLoading(true);

        try {
            if (!email || !password || !name || !confirmPassword) {
                Alert.alert("Missing fields", "Please enter name, email and password.");
                return;
            }
                        
            // Here you would replace with your real API call
            // const response = await fetch(...)

            Alert.alert("Success", "Registered in successfully!");
        } catch (error) {
            Alert.alert("Register Failed", "Something went wrong.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableOpacity className="flex flex-col h-full p-8 bg-white">
            <View className="p-4 h-[350px]">
                <Text className="text-black text-2xl font-bold">Sign up</Text>
                <Text className="text-gray-700 mt-1">Create a new account</Text>
                <View className="mt-8 h-2/3">
                    <Text className="text-gray-700 font-semibold text-md">Name</Text>
                    <TextInput
                        className="border border-gray-300 text-gray-700 rounded-xl p-3 mt-4 focus:border-gray-500 focus:ring-gray-500"
                        placeholder="Full Name"
                        onChangeText={setName}
                    />
                    <Text className="text-gray-700 font-semibold text-md mt-4">Email</Text>
                    <TextInput
                        className="border border-gray-300 text-gray-700 rounded-xl p-3 mt-4 focus:border-gray-500 focus:ring-gray-500"
                        placeholder="Email"
                        onChangeText={setEmail}
                    />
                    <Text className="text-gray-700 font-semibold text-md mt-4">Password</Text>
                    <TextInput
                        className="border border-gray-300 text-gray-700 rounded-xl p-3 mt-4 focus:border-gray-500 focus:ring-gray-500"
                        placeholder="Password"
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        className="border border-gray-300 text-gray-700 rounded-xl p-3 mt-4 focus:border-gray-500 focus:ring-gray-500 mb-4"
                        placeholder="Confirm Password"
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                    <Button onPress={register} color="gray" disabled={isLoading} title={isLoading ? "Loading..." : "Register"} />
                    <Text className="text-gray-700 text-center mt-4">Already a member? <Link href="/login" className="font-bold">Login</Link></Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default RegisterPage;