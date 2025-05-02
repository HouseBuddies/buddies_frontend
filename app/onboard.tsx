import onboardingData from '@/assets/onboardingData.json'; // adjust path as needed
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState({});
  const [showComplete, setShowComplete] = useState(false);

  const toggleOption = (key, item) => {
    setFormState(prev => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(item)
          ? current.filter(i => i !== item)
          : [...current, item],
      };
    });
  };

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowComplete(true); // Final screen
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (showComplete) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center p-5">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 justify-center items-center w-full p-4">
          <Text className="text-6xl text-green-500 mb-4">✓</Text>
          <Text className="text-2xl font-bold text-slate-700 mb-2">All finished!</Text>
          <Text className="text-base text-slate-500 mb-6 text-center">
            You're all set up and ready to go.
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/')}
            className="bg-slate-700 w-full py-3 rounded-lg items-center"
            >
            <Text className="text-white font-medium">Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { title, subtitle, options, stateKey } = onboardingData[currentStep];
  const selected = formState[stateKey] || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 p-5">
        {/* Progress Bar */}
        <View className="h-1.5 bg-slate-200 rounded-full mb-5 overflow-hidden">
          <View
            className="bg-slate-700 h-full"
            style={{ width: `${(currentStep / onboardingData.length) * 100}%` }}
          />
        </View>

        {/* Header */}
        <Text className="text-2xl font-bold text-slate-700">{title}</Text>
        <Text className="text-base text-slate-500 mt-1">{subtitle}</Text>

        {/* Options */}
        <ScrollView className="flex-1 my-4">
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => toggleOption(stateKey, opt)}
              className={`flex-row justify-between items-center p-3 rounded-lg my-1 ${
                selected.includes(opt)
                  ? 'bg-sky-50'
                  : 'bg-white border border-slate-200'
              }`}
            >
              <Text
                className={`text-base ${
                  selected.includes(opt)
                    ? 'text-slate-700 font-medium'
                    : 'text-slate-600'
                }`}
              >
                {opt}
              </Text>
              {selected.includes(opt) && (
                <Text className="text-lg text-slate-700">✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer Buttons */}
        <View className="mt-2">
          {/* Step Indicator */}
          <Text className="text-slate-500 text-sm mb-2">
            Step {currentStep + 1} of {onboardingData.length}
          </Text>
          {currentStep === 0 ? (
            <TouchableOpacity
              onPress={handleNext}
              disabled={selected.length === 0}
              className={`w-full py-3 rounded-lg items-center ${
                selected.length === 0 ? 'bg-slate-400' : 'bg-slate-700'
              }`}
            >
              <Text className="text-white font-medium">Next</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row">
              <TouchableOpacity
                onPress={handleBack}
                className="flex-1 py-3 border border-slate-300 rounded-lg mr-2 items-center"
              >
                <Text className="text-slate-700 font-medium">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                disabled={selected.length === 0}
                className={`flex-1 py-3 rounded-lg items-center ${
                  selected.length === 0 ? 'bg-slate-400' : 'bg-slate-700'
                }`}
              >
                <Text className="text-white font-medium">
                  {currentStep === onboardingData.length - 1 ? 'Complete' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
