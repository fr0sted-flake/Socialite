import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { icons, images } from "../../constants";
import { SearchInput, Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const ChatBot = () => {
  const { userToken } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = () => {
    if (inputMessage.trim().length > 0) {
      setMessages([...messages, { id: Date.now(), text: inputMessage, sender: 'user' }]);
      setInputMessage("");
      // Simulate chatbot response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: "This is a sample response from the chatbot.", sender: 'bot' }]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }) => (
    <View className={`${item.sender === 'user' ? 'self-end bg-secondary' : 'self-start bg-black-100'} px-4 py-2 my-1 rounded-2xl max-w-[70%]`}>
      <Text className={`${item.sender === 'user' ? 'text-primary' : 'text-white'} font-pregular`}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoading} />
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
        ListHeaderComponent={() => (
          <View className="flex my-6 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Chat with
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Socialite Bot
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
          </View>
        )}
      />
      <View className="flex-row items-center px-4 py-2 bg-black-100">
        <TextInput
          className="flex-1 bg-black-200 text-white font-pregular rounded-2xl px-4 py-2 mr-2"
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
          placeholderTextColor="#7B7B8B"
        />
        <TouchableOpacity onPress={sendMessage} className="bg-secondary rounded-full p-2">
          <Image source={icons.send}  className="w-6 h-6" resizeMode="contain" tintColor="#000000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatBot;