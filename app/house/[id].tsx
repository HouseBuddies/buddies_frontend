"use client";

import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/context/AuthContext";
import { fetchUserInfo } from "@/data/auth/auth";
import {
  addFavoriteHouse,
  applyToJoin,
  getUserFavoriteHouses,
  has_applyToJoin,
  removeApplyToJoin,
  removeFavoriteHouse,
  showHouse,
} from "@/data/houses/houses";
import Constants from "expo-constants";
import { Link, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "";
const apiKey = Constants.expoConfig?.extra?.googleApiKey;

// Get screen dimensions
const { width } = Dimensions.get("window");

// Define proper TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  age: number;
}

interface House {
  id: string;
  image: string;
  rent: number;
  address: string;
  owner: {
    id: string;
    name: string;
    email?: string;
    photo?: string;
  };
  tags: string[];
  min_rent: number;
  max_rent: number;
}

interface FavoriteHouse {
  house: {
    id: string;
  };
}

const HouseDetails = () => {
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [house, setHouse] = useState<House | null>(null);
  const [favourite, setFavourite] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom map dimensions
  const mapHeight = 270;
  const mapWidth = width - 32;
  const mapSize = `${Math.round(mapWidth)}x${mapHeight}`;
  const circleRadius = 300;
  const circleColor = "0x8AADF488";
  const circleBorder = "0x3B82F6";

  const formatAddress = useCallback((address: string) => {
    if (!address) return "";
    const parts = address.split(" ");
    return parts.slice(-2).join(" ");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      if (!id) {
        setError("House ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [userResponse, houseResponse] = await Promise.all([
          fetchUserInfo(token),
          showHouse(id.toString(), token),
        ]);

        if (userResponse?.user) {
          setUser(userResponse.user);

          if (houseResponse?.data) {
            const applicationStatus = await has_applyToJoin(
              houseResponse.data.id,
              userResponse.user.id,
              token
            );
            setHasApplied(!!applicationStatus);
          }
        }

        if (houseResponse?.data) {
          setHouse(houseResponse.data);
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setIsLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [token, id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user?.id || !house?.id || !token) return;

      try {
        const response = await getUserFavoriteHouses(user.id, token);
        if (response?.data) {
          const isFavorite = response.data.some(
            (favoriteHouse: FavoriteHouse) => favoriteHouse.house.id === house.id
          );
          setFavourite(isFavorite);
        }
      } catch (err) {
        console.error("Error checking favorites:", err);
      }
    };

    checkFavorite();
  }, [user, house, token]);

  const toggleFavorite = useCallback(async () => {
    if (!house?.id || !token || !user?.id) {
      Alert.alert("Error", "Unable to update favorites");
      return;
    }

    try {
      const response = favourite
        ? await removeFavoriteHouse(house.id, user.id, token)
        : await addFavoriteHouse(house.id, user.id, token);

      if (response) {
        setFavourite(!favourite);
      } else {
        Alert.alert("Error", "Failed to update favorites");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      Alert.alert("Error", "An error occurred while updating favorites");
    }
  }, [favourite, house, user, token]);

  const handleApplyToJoin = useCallback(async () => {
    if (!house?.id || !token || !user?.id) {
      Alert.alert("Error", "Unable to apply for this house");
      return;
    }

    try {
      setIsApplying(true);

      if (hasApplied) {
        Alert.alert(
          "Cancel Application",
          "Are you sure you want to cancel your application for this house?",
          [
            { text: "No", style: "cancel", onPress: () => setIsApplying(false) },
            {
              text: "Yes, Cancel",
              style: "destructive",
              onPress: async () => {
                try {
                  const response = await removeApplyToJoin(
                    house.id,
                    user.id,
                    token
                  );
                  if (response) {
                    setHasApplied(false);
                    Alert.alert("Success", "Your application has been cancelled.");
                  } else {
                    Alert.alert("Error", "Failed to cancel application");
                  }
                } catch (error) {
                  console.error("Error cancelling application:", error);
                  Alert.alert(
                    "Error",
                    "An error occurred while cancelling your application"
                  );
                } finally {
                  setIsApplying(false);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Apply to Join",
          "Are you sure you want to apply to join this house?",
          [
            { text: "Cancel", style: "cancel", onPress: () => setIsApplying(false) },
            {
              text: "Apply",
              onPress: async () => {
                try {
                  const response = await applyToJoin(house.id, user.id, token);
                  if (response) {
                    setHasApplied(true);
                    Alert.alert("Success", "Your application has been submitted!");
                  } else {
                    Alert.alert("Error", "Failed to submit application");
                  }
                } catch (error) {
                  console.error("Error applying to join:", error);
                  Alert.alert(
                    "Error",
                    "An error occurred while submitting your application"
                  );
                } finally {
                  setIsApplying(false);
                }
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("Error with application process:", err);
      Alert.alert("Error", "An error occurred with your application");
      setIsApplying(false);
    }
  }, [house, user, token, hasApplied]);

  const getStaticMapUrl = useCallback(() => {
    if (!house?.address || !apiKey) return "";

    return (
      `https://maps.googleapis.com/maps/api/staticmap?` +
      `center=${encodeURIComponent(house.address)}` +
      `&zoom=16` +
      `&size=${mapSize}` +
      `&scale=2` +
      `&path=fillcolor:${circleColor}` +
      `%7Ccolor:${circleBorder}` +
      `%7Cweight:1` +
      `%7Ccenter:${encodeURIComponent(house.address)}` +
      `%7Cradius:${circleRadius}` +
      `&key=${apiKey}`
    );
  }, [house, mapSize, apiKey]);

  const houseImage = house?.image
    ? `${API_URL.replace("/api", "")}${house.image}`
    : "";

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
        <Text className="text-red-500 text-lg">{error}</Text>
        <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded-lg">
          <Link href="/home" className="text-white">
            Go Back
          </Link>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1">
        {/* Property Image Section */}
        <View className="relative h-80">
          {house && houseImage ? (
            <Image
              source={{ uri: houseImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 justify-center items-center">
              <Text className="text-gray-500">No image available</Text>
            </View>
          )}
          <View className="absolute w-full flex-row justify-between p-4">
            <TouchableOpacity>
              <Link href="/home" className="text-3xl text-white">
                ✕
              </Link>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleFavorite}
              accessibilityLabel={
                favourite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Text
                className={`text-3xl ${
                  favourite ? "text-primary" : "text-white"
                }`}
              >
                {favourite ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Property Details */}
        <View className="p-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-semibold">
              {formatAddress(house?.address || "")}
            </Text>
            <Text className="text-lg">
              {house?.min_rent} € - {house?.max_rent} €
            </Text>
          </View>
          {/* Profile Section */}
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: house?.owner?.photo }}
                className="w-12 h-12 rounded-full bg-gray-200"
              />
              <Text className="ml-3 text-lg">
                {house?.owner?.name || "Unknown Owner"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleApplyToJoin}
              disabled={isApplying}
              className={`${
                hasApplied ? "bg-red-500" : "bg-blue-500"
              } py-2 px-4 rounded-lg ${isApplying ? "opacity-70" : ""}`}
              accessibilityLabel={
                hasApplied ? "Cancel application" : "Apply to join this house"
              }
            >
              {isApplying ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-white text-center font-bold">
                  {hasApplied ? "Cancel Application" : "Apply to Join"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/* Interests Section */}
          {house?.tags && house.tags.length > 0 && (
            <View className="mt-6">
              <Text className="text-xl mb-3">Interesses</Text>
              <View className="flex-row flex-wrap gap-2">
                {house.tags.map((interest, index) => (
                  <View
                    key={index}
                    className="py-2 px-4 border border-gray-300 rounded-full"
                  >
                    <Text>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {/* Property Features Section */}
          <View className="mt-6">
            <Text className="text-xl mb-3">Características específicas</Text>
            <View className="space-y-2">
              {[
                "58 m² área bruta",
                "T1",
                "1 casa de banho",
                "Varanda",
                "Lugar de garagem incluído no preço",
                "Segunda mão/bom estado",
                "Armários embutidos",
                "Orientação Sul",
                "Mobilado e cozinha equipada",
                "Aquecimento individual: Elétrico",
              ].map((item, index) => (
                <View key={index} className="flex-row items-center">
                  <Text className="text-base">• {item}</Text>
                </View>
              ))}
            </View>
          </View>
          {/* Enhanced Address Section */}
          <View className="mt-6">
            <Text className="text-xl font-semibold">Morada</Text>
            <View
              className="rounded-lg overflow-hidden"
              style={{ height: mapHeight }}
            >
              {house?.address && apiKey ? (
                <>
                  <Image style={{ height: mapHeight-30, width: mapWidth }}
                    source={{ uri: getStaticMapUrl() }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute p-16 bg-blue-300/40 border border-2 border-blue-400 rounded-full mx-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  </View>
                </>
              ) : (
                <View className="w-full h-full bg-gray-200 justify-center items-center">
                  <Text className="text-gray-500">Map not available</Text>
                </View>
              )}
            </View>
          </View>
          
           {/* Two-Column Section */}
           <View className="flex-row mt-6">
            {/* Left Column */}
            <View className="flex-1 pr-2">
              <Text className="text-xl mb-3">Equipamento</Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Text className="text-base">• Ar condicionado</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base">• Máquina de lavar roupa</Text>
                </View>
              </View>

              <View className="mt-6">
                <Text className="text-xl mb-3">Prédio</Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Text className="text-base">• 1º andar</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-base">• Com elevador</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View className="flex-1 pl-2">
              <Text className="text-xl mb-3">Certificado energético</Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Text className="text-base">• Classe energética: A+</Text>
                </View>
              </View>
            </View>
          </View>


        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

export default HouseDetails;