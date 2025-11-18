import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokemon } from "contexts/PokemonContext";
import PokemonCard from "@/components/PokemonCard";

const PokemonParty = () => {
  const { myPokemon } = usePokemon();

  return (
    <SafeAreaView className="flex items-center bg-red-800 h-full w-full">
      <Text className="text-2xl font-extrabold mt-2 text-white">
        Pokémon Capturados
      </Text>

      <FlatList
        numColumns={1}
        data={myPokemon}
        keyExtractor={(item) => item.id}
        className="h-full w-full"
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
      />
    </SafeAreaView>
  );
};

export default PokemonParty;
