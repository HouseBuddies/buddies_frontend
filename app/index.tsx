import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/login">Go to Home</Link>
    </View>
  );
}
