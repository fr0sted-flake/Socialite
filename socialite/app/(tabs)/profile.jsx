import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Text,
  RefreshControl,
} from "react-native";
import { images, BASE_URL } from "../../constants";
import axios from "axios";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState, InfoBox, EventCard, Loader } from "../../components";

const Profile = () => {
  const { userToken, userInfo, logout, delAcc } = useGlobalContext();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCreatedEvents = useCallback(async () => {
    try {
      const eventsResponse = await axios.get(
        `${BASE_URL}/users/created-events`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setCreatedEvents(eventsResponse.data.events);
    } catch (error) {
      console.error("Error fetching created events:", error);
      Alert.alert("Error", "Failed to fetch created events");
    }
  }, [userToken]);

  const fetchRegisteredEvents = useCallback(async () => {
    try {
      const eventsResponse = await axios.get(
        `${BASE_URL}/users/registered-events`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setRegisteredEvents(eventsResponse.data.events);
    } catch (error) {
      console.error("Error fetching registered events:", error);
      Alert.alert("Error", "Failed to fetch registered events");
    }
  }, [userToken]);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchCreatedEvents(), fetchRegisteredEvents()]);
    setIsLoading(false);
  }, [fetchCreatedEvents, fetchRegisteredEvents]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, [fetchEvents]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoading} />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Your Profile
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
            <View className="w-full items-center justify-center">
  <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
    <Image
      source={images.avatar}
      className="w-[90%] h-[90%] rounded-lg"
      resizeMode="cover"
    />
  </View>
</View>
            <InfoBox title={userInfo?.name} subtitle={userInfo?.email} />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="flex-row items-center bg-black-100 px-4 py-2 rounded-xl"
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  className="w-5 h-5 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-white">Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center bg-red-500 px-4 py-2 rounded-xl"
                onPress={delAcc}
              >
                <Image
                  source={icons.deleteAccount}
                  className="w-5 h-5 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-white">Delete Account</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full flex-1 pt-5">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Created Events
              </Text>
              {createdEvents.length > 0 ? (
                createdEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    title={event.title}
                    location={event.eventLocation}
                    eventId={event._id}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Created Events"
                  subtitle="You haven't created any events yet"
                />
              )}
            </View>

            <View className="w-full flex-1 pt-5">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Registered Events
              </Text>
              {registeredEvents.length > 0 ? (
                registeredEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    title={event.title}
                    location={event.eventLocation}
                    eventId={event._id}
                  />
                ))
              ) : (
                <EmptyState
                  title="No Registered Events"
                  subtitle="You haven't registered for any events yet"
                />
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
