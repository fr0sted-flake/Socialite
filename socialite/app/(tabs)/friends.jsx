import React, { useState, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { icons, images, BASE_URL } from "../../constants";
import { Loader, EmptyState } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import axios from "axios";

const FriendCard = ({ id, name, username, avatar, onToggleFriend }) => (
  <TouchableOpacity className="flex-row items-center justify-between px-4 py-3 bg-black-100 rounded-xl mb-3">
    <View className="flex-row items-center">
      <Image 
        source={avatar ? { uri: avatar } : images.defaultAvatar} 
        className="w-12 h-12 rounded-full mr-3"
      />
      <View>
        <Text className="font-psemibold text-white text-base">{name}</Text>
        <Text className="font-pregular text-gray-300 text-sm">@{username}</Text>
      </View>
    </View>
    <TouchableOpacity onPress={() => onToggleFriend(id)} className="bg-blue-500 px-3 py-1 rounded">
      <Text className="text-white">Toggle Friend</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const Friends = () => {
  const { userToken } = useGlobalContext();
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/users/${searchQuery}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Failed to search users:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const toggleFriend = async (friendId) => {
    try {
      await axios.post(`${BASE_URL}/users/toggle-friend/${friendId}`, {}, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      fetchFriends();
      if (isSearching) {
        handleSearch();
      }
    } catch (error) {
      console.error("Failed to toggle friend status:", error);
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
            id={item._id}
            name={item.name}
            username={item.email.split('@')[0]}
            avatar={item.photoUrl}
            onToggleFriend={toggleFriend}
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
        <View className="flex-row items-center space-x-2">
          <TextInput
            className="flex-1 bg-black-100 text-white px-4 py-2 rounded-xl"
            placeholder="Search friends..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearchInputChange}
          />
          <TouchableOpacity onPress={handleSearch} className="bg-blue-500 px-4 py-2 rounded-xl">
            <Text className="text-white">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

export default Friends;