import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YOUR_POKEMON_DATA } from "../../functions/UI.utils";
import PokemonCard from "@/components/PokemonCard";
import IntroAnimeAd from "@/components/IntroAnimeAd";

//bg-red-800
//bg-red-600
//bg-black
const pokemon = () => {
  return (
    <SafeAreaView className="flex items-center bg-red-800">
      <Text className="text-2xl font-extrabold mt-2 text-white">
        Pokemon Capturados
      </Text>
      <FlatList
        numColumns={1}
        data={YOUR_POKEMON_DATA}
        className="h-full w-full"
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
      />
      <IntroAnimeAd />
    </SafeAreaView>
  );
};

export default pokemon;
