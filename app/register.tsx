import { useAuth } from "@/context/AuthContext";
import { sign_up } from "@/data";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View
} from "react-native";

const SignUpPage = () => {
  const { setToken } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    // Add keyboard show/hide listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const register = async () => {
    setIsLoading(true);
    try {
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert("Missing fields", "Please fill in all fields.");
        return;
      }
      
      if (password !== confirmPassword) {
        Alert.alert("Password mismatch", "Passwords do not match.");
        return;
      }
      
      if (!termsAccepted) {
        Alert.alert("Terms and Conditions", "Please accept the Terms and Conditions to continue.");
        return;
      }
      
      // Replace with your actual sign-up API call
      const response = await sign_up(name, email, password);
      if (response.status !== 200) {
        Alert.alert("Registration Failed", "Could not create account.");
        return;
      }
      const data = await response.data;
      await setToken(data.user.token);
      router.push("/home");
    } catch (error) {
      Alert.alert("Registration Failed", "Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex flex-col h-full">
              {/* Header Image - similar to login page */}
              <View className={`py-4 ${keyboardVisible ? 'h-[100px]' : 'h-[250px]'} flex items-center justify-center overflow-hidden`}>
                <Image 
                  source={require("@/assets/images/header-login.jpeg")} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              
              <View className="px-6 mt-6">
                <Text className="text-black text-3xl font-bold">Sign up</Text>
                <Text className="text-gray-500 mt-1 mb-4">Create an account to get started</Text>
              
                <View className="mt-2">
                  <Text className="text-gray-700 mb-2">Name</Text>
                  <TextInput
                    onChangeText={setName}
                    className="border border-gray-300 text-black rounded-xl p-4 mb-4"
                    placeholder="Enter your name"
                    value={name}
                    autoCapitalize="words"
                  />
                  
                  <Text className="text-gray-700 mb-2">Email Address</Text>
                  <TextInput
                    onChangeText={setEmail}
                    className="border border-gray-300 text-black rounded-xl p-4 mb-4"
                    placeholder="name@email.com"
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  
                  <Text className="text-gray-700 mb-2">Password</Text>
                  <View className="relative mb-4">
                    <TextInput
                      onChangeText={setPassword}
                      className="border border-gray-300 text-black rounded-xl p-4 pr-12"
                      placeholder="Create a password"
                      secureTextEntry={!showPassword}
                      value={password}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-0 bottom-0 justify-center"
                    >
                      <Text className="text-gray-400">👁️</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View className="relative mb-6">
                    <TextInput
                      onChangeText={setConfirmPassword}
                      className="border border-gray-300 text-black rounded-xl p-4 pr-12"
                      placeholder="Confirm password"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-0 bottom-0 justify-center"
                    >
                      <Text className="text-gray-400">👁️</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View className="flex-row items-center mb-6">
                    <TouchableOpacity
                      onPress={() => setTermsAccepted(!termsAccepted)}
                      className={`w-5 h-5 border border-gray-300 rounded mr-3 ${termsAccepted ? 'bg-primary' : 'bg-white'}`}
                    />
                    <Text className="text-gray-700 flex-1">
                      I've read and agree with the{" "}
                      <Text className="text-primary font-bold">Terms and Conditions</Text>
                      {" "}and the{" "}
                      <Text className="text-primary font-bold">Privacy Policy</Text>
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={register}
                    disabled={isLoading}
                    className="bg-primary rounded-xl p-4 items-center"
                  >
                    <Text className="text-white font-semibold text-lg">
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Text>
                  </TouchableOpacity>
                  
                  <Text className="text-gray-700 text-center mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-primary">
                      Login
                    </Link>
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpPage;