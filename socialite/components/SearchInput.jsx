import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

const SearchInput = ({ initialQuery, onPressed }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const handlePress = () => {
    if (query === "") {
      return Alert.alert(
        "Missing Query",
        "Please input something to search results across database"
      );
    }

    if (onPressed) {
      onPressed(query);
    } else {
      // Default behavior if onPressed is not provided
      if (pathname.startsWith("/search")) router.setParams({ query });
      else router.push(`/search/${query}`);
    }
  };

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search an event"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity onPress={handlePress}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;