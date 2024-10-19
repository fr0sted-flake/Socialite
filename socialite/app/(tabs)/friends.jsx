import React, { useState, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { icons, images, BASE_URL } from "../../constants";
import { SearchInput, Loader, EmptyState } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import axios from "axios";

const FriendCard = ({ name, username, avatar }) => (
  <TouchableOpacity className="flex-row items-center px-4 py-3 bg-black-100 rounded-xl mb-3">
    <Image 
      source={avatar ? { uri: avatar } : images.defaultAvatar} 
      className="w-12 h-12 rounded-full mr-3"
    />
    <View>
      <Text className="font-psemibold text-white text-base">{name}</Text>
      <Text className="font-pregular text-gray-300 text-sm">@{username}</Text>
    </View>
  </TouchableOpacity>
);

const Friends = () => {
  const { userToken } = useGlobalContext();
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/users/get-friends`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
    }, [])
  );

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    const data = isSearching ? searchResults : friends;
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <FriendCard
            name={item.name}
            username={item.username}
            avatar={item.photoUrl}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={isSearching ? "No Users Found" : "No Friends Yet"}
            subtitle={isSearching ? "Try a different search term" : "Add friends to see them here"}
          />
        )}
      />
    );
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoading} />
      <View className="flex my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Your Friends
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
        <SearchInput onSearch={handleSearch} />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

export default Friends;