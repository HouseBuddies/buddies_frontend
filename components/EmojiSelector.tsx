import { Text, TouchableOpacity, View } from "react-native"

interface EmojiSelectorProps {
  emojis: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export default function EmojiSelector({ emojis, selectedIndex, onSelect }: EmojiSelectorProps) {
  return (
    <View className="flex-row justify-between w-full">
      {emojis.map((emoji, index) => (
        <TouchableOpacity
          key={index}
          className={`items-center justify-center p-2 ${selectedIndex === index ? "bg-blue-100 rounded-full" : ""}`}
          onPress={() => onSelect(index)}
        >
          <Text className="text-2xl">{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
