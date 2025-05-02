import { useAuth } from "@/context/AuthContext";
import { sign_in } from "@/data";
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


const LoginPage = () => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
        setKeyboardVisible(true)
    }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setKeyboardVisible(false)
        }
    );

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const oauthProviders = [
    { color: "#ED3241", name: "google", image: require("@/assets/images/oauth/google.png") },
    { color: "#000000", name: "apple", image: require("@/assets/images/oauth/apple.png") },
    { color: "#00A4EF", name: "microsoft", image: require("@/assets/images/oauth/microsoft.png") }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex flex-col h-full">
              <View className={`py-4 ${keyboardVisible ? 'h-[100px]' : 'h-[320px]'} flex items-center justify-center overflow-hidden`}>
                <Image 
                  source={require("@/assets/images/header-login.jpeg")} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="mt-8 px-4 h-2/3">
                <Text className="text-black text-4xl font-bold">Welcome!</Text>
                <TextInput
                  onChangeText={setEmail}
                  className="border border-gray-400 text-primary rounded-2xl p-5 mt-4 placeholder:text-gray-400"
                  placeholder="Email Address"
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  onChangeText={setPassword}
                  className="border border-gray-400 text-primary rounded-2xl p-5 mt-4 placeholder:text-gray-400"
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                />
                <Link href="/" className="text-primary font-semibold my-4">
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
                
                {!keyboardVisible && (
                  <>
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
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;