import { useAuth } from "@/context/AuthContext";
import { sign_in } from "@/data";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";


const LoginPage = () => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const oauthProviders = [
    { color: "#ED3241", name: "google", image: require("@/assets/images/oauth/google.png") },
    { color: "#000000", name: "apple", image: require("@/assets/images/oauth/apple.png") },
    { color: "#ED3241", name: "facebook", image: require("@/assets/images/oauth/google.png") }
  ];

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
      const data = await response.data;
      await setToken(data.user.token);
      router.push("/home");
    } catch (error) {
      Alert.alert("Login Failed", "Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex flex-col h-full">
        <View className="bg-gray-200 p-4 h-[320px] flex items-center justify-center">
          <View className="text-white text-2xl font-bold"></View>
        </View>
        <View className="mt-8 px-4 h-2/3">
          <Text className="text-black text-4xl font-bold">Welcome!</Text>
          <TextInput
            onChangeText={setEmail}
            className="border border-gray-400 text-primary rounded-2xl p-5 mt-4 placeholder:text-gray-400"
            placeholder="Email Address"
            value={email}
          />
          <TextInput
            onChangeText={setPassword}
            className="border border-gray-400 text-primary rounded-2xl p-5 mt-4 placeholder:text-gray-400"
            placeholder="Password"
            secureTextEntry
            value={password}
          />
          <Link href="/" className="text-primary :bg-transparent font-semibold my-4">
            Forgot Password?
          </Link>
          <TouchableOpacity
            onPress={login}
            disabled={isLoading}
            className="bg-primary rounded-2xl p-5 mt-4 items-center"
            >
            <Text className="text-white font-semibold text-lg">
                {isLoading ? "Loading..." : "Login"}
            </Text>
          </TouchableOpacity>
          <Text className="text-gray-700 text-center mt-4">
            Not a member?{" "}
            <Link href="/register" className="font-bold text-primary">
              Register now
            </Link>
          </Text>
          <View className="border-b border-gray-400 my-6" />
          <Text className="text-gray-700 text-center">Or continue with</Text>
          <View className="flex flex-row justify-center mt-4">
            {oauthProviders.map((oauth, i) => (
              <TouchableOpacity
                key={i}
                className="rounded-full p-4 mx-2"
                style={{ backgroundColor: oauth.color }}
              >
                <Image
                  source={oauth.image}
                  className="w-4 h-4"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;
