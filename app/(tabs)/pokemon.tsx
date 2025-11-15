import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React from "react";
import { YOUR_POKEMON_DATA } from "../../functions/UI.utils";
import PokemonCard from "@/components/PokemonCard";
const pokemon = () => {
  return (
    <View>
      <FlatList
        numColumns={2}
        data={YOUR_POKEMON_DATA}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
      />
    </View>
  );
};

export default pokemon;
