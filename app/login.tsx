import { sign_in } from "@/data";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const login = async () => {
        setIsLoading(true);

        try {
            if (!email || !password) {
                Alert.alert("Missing fields", "Please enter both email and password.");
                return;
            }            

            const response = await sign_in(email, password);
            if (response.status !== 200) {
                Alert.alert("Login Failed", "Invalid email or password.");
                return;
            }

            const data = await response.json();

            console.log("Login successful:", data);

            Alert.alert("Success", "Logged in successfully!");
        } catch (error) {
            Alert.alert("Login Failed", "Something went wrong.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <TouchableOpacity className="flex flex-col h-full">
            <View className="bg-gray-200 p-4 h-[350px] flex items-center justify-center">
                <View className="text-white text-2xl font-bold"></View>
            </View>
            <View className="mt-8 px-4 h-2/3">
                <Text className="text-black text-4xl font-bold">Welcome!</Text>
                <TextInput
                    onChangeText={setEmail}
                    className="border border-gray-300 text-gray-700 rounded-lg p-3 mt-4"
                    placeholder="Email"
                    value={email}
                />
                <TextInput
                    onChangeText={setPassword}
                    className="border border-gray-300 text-gray-700 rounded-lg p-3 mt-4"
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                />
                <Link href="/" className="text-gray-700 text-white font-semibold rounded-lg my-4">Forgot Password?</Link>
                <Button onPress={login} color="gray" disabled={isLoading} title={isLoading ? "Loading..." : "Login"} />
                <Text className="text-gray-700 text-center mt-4">Not a member? <Link href="/register" className="font-bold">Register now</Link></Text>
                <View className="border-b border-gray-300 my-6" />
                <Text className="text-gray-700 text-center">Or continue with</Text>
                <View className="flex flex-row justify-center mt-4">
                    {[1, 2, 3].map((_, i) => (
                        <TouchableOpacity key={i} className="bg-white border border-gray-300 rounded-lg p-2 mx-2">
                            <Image source={require('@/assets/images/react-logo.png')} className="w-4 h-4" />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default LoginPage;