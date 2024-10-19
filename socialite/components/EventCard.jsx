import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { images, icons } from "../constants";

const EventCard = ({ title, location, eventId }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/event/${eventId}`)}
      className="flex flex-col items-center px-4 mb-6"
    >
      <View className="flex flex-row items-center w-full">
        <View className="w-[45px] h-[45px] rounded-lg border border-secondary flex justify-center items-center p-0.5 mr-3">
          <Image
            source={images.eventImage}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <Text
            className="font-psemibold text-sm text-white"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="text-xs text-gray-200 font-pregular"
            numberOfLines={1}
          >
            At: {location}
          </Text>
        </View>

        <Image
          source={icons.halfArrow}
          className="w-6 h-6"
          resizeMode="contain"
          tintColor="#FFA001"
        />
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;