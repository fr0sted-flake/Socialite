import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
  Alert,
} from "react-native";
import axios from "axios";
import { images, BASE_URL } from "../../constants";
import { EmptyState, SearchInput, EventCard, Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { icons } from "../../constants";

const Home = () => {
  const { userToken } = useGlobalContext();
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const fetchEvents = async () => {
    setIsLoading(true); // Start loader
    try {
      const response = await axios.get(`${BASE_URL}/events`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setEvents(response.data.events);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.resultMessage || "Failed to fetch events"
      );
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoading} />
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            location={item.eventLocation}
            eventId={item._id}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Socialite
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Events
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Events Found"
            subtitle="No events created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        onPress={() => router.push("/createEvent")}
        className="absolute bottom-5 right-3 bg-secondary px-3 py-2 rounded-lg flex flex-row items-center justify-center shadow-lg"
      >
        <Image
          source={icons.plus}
          className="w-5 h-5 mr-2"
          resizeMode="contain"
        />
        <Text className="text-primary font-psemibold text-base">Add event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
