import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/register">Go to Home</Link>
    </View>
  );
}
