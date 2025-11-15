import { View, Text, Image } from "react-native";
import React from "react";
import { pokemonSprite } from "functions/helpers";
import { POKEMON_TYPE_BACKGROUNDS } from "functions/UI.utils";

const PokemonCard = ({ pokemon }) => {
  return (
    <View
      className={`border flex-1 flex-col m-1 rounded-lg p-2 items-stretch justify-center h-64 shadow ${POKEMON_TYPE_BACKGROUNDS[pokemon.type]}`}
    >
      <View className="border h-32">
        <Image
          source={{ uri: pokemonSprite(pokemon.pokedex_number) }}
          className="size-full"
        />
      </View>
      <View>
        <Text>{pokemon.mote || pokemon.name}</Text>
      </View>
    </View>
  );
};

export default PokemonCard;
