import { Text, TouchableOpacity, View } from "react-native";


const BottomNavigation = () => {
    return(
        <View className="flex-row justify-between items-center p-4 bg-white border-t border-gray-200">
            <TouchableOpacity className="items-center">
            <Text className="text-2xl text-gray-700">⊞</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
            <Text className="text-2xl text-gray-700">★</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-2xl text-white">🔍</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
            <Text className="text-2xl text-gray-700">💬</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
            <Text className="text-2xl text-gray-700">👤</Text>
            </TouchableOpacity>
        </View>
    )
}  

export default BottomNavigation;