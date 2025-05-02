import { Redirect } from "expo-router";
import {
  SafeAreaView,
} from 'react-native';
;

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Redirect href="/login" />
    </SafeAreaView>
  )
}