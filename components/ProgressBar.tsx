import { Text, View } from "react-native"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <View className="w-full">
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </Text>
        <Text className="text-sm font-medium text-gray-700">{Math.round(progress)}%</Text>
      </View>
      <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <View className="h-full bg-blue-600 rounded-full" style={{ width: `${progress}%` }} />
      </View>
    </View>
  )
}
