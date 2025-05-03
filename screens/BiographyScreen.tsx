import { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function AboutYouScreen({ navigation, route }) {
  const { demographics, livingPreferences, personalityLifestyle } = route.params;
  const [biography, setBiography] = useState('');

  const handleNext = () => {
    navigation.navigate('Summary', {
      ...route.params,
      biography: biography,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-6 mt-8">
          {/* Sticky Header */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-left">
              Let’s get to know you better.
            </Text>
            <Text className="text-base text-gray-600 text-left">
              Share a few words about yourself, your dream home, where you'd love to live, and the kind of roommates you'd vibe with!
            </Text>
          </View>

          {/* Scrollable Input */}
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800"
              style={{ height: 200, textAlignVertical: 'top' }}
              multiline
              placeholder="E.g. I love quiet evenings, prefer the city center, and value cleanliness in roommates."
              value={biography}
              onChangeText={setBiography}
            />
          </ScrollView>
        </View>

        {/* Sticky Bottom Button */}
        <View className="px-6 pb-6 bg-white">
          <TouchableOpacity
            className={`bg-primary rounded-lg py-3 ${!biography ? 'opacity-50' : ''}`}
            onPress={handleNext}
            disabled={!biography}
          >
            <Text className="text-center text-white text-lg font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
