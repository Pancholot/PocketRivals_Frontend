import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { pokemonSprite } from "functions/helpers";
import { POKEMON_TYPE_BACKGROUNDS } from "functions/UI.utils";
import { useRouter } from "expo-router";
import GlobalButton from "./GlobalButton";

const PokemonCard = ({ pokemon }) => {
  const theme = POKEMON_TYPE_BACKGROUNDS[pokemon.type1];
  {
    /* Esto solo está aquí para que se vean los colores */
  }
  const colorType = {
    normal: "bg-[#a8a878]",
    fire: "bg-[#f08030]",
    water: "bg-[#6890f0]",
    electric: "bg-[#f8d030]",
    grass: "bg-[#78c850]",
    ice: "bg-[#98d8d8]",
    fighting: "bg-[#c03028]",
    poison: "bg-[#a040a0]",
    ground: "bg-[#e0c068]",
    flying: "bg-[#a890f0]",
    psychic: "bg-[#f85888]",
    bug: "bg-[#a8b820]",
    rock: "bg-[#b8a038]",
    ghost: "bg-[#705898]",
    dragon: "bg-[#7038f8]",
    dark: "bg-[#705848]",
    steel: "bg-[#b8b8d0]",
    fairy: "bg-[#ee99ac]",
  };

  const router = useRouter();
  return (
    <GlobalButton
      className={`
    flex-col mx-4 my-2 rounded-lg h-64 shadow-md ${theme} overflow-hidden
  `}
      onPress={() => {
        if (pokemon.friendId) {
          router.push(
            `/stats/${pokemon.pokedex_number}?from=amigo&friendId=${pokemon.friendId}`
          );
        } else {
          router.push(`/stats/${pokemon.pokedex_number}?from=propio`);
        }
      }}
    >
      <View className="flex-1 justify-center items-center p-4">
        <Image
          source={{ uri: pokemonSprite(pokemon.pokedex_number) }}
          className="h-32 w-32"
          resizeMode="contain"
        />
      </View>

      <View className="h-20 justify-center items-center bg-black/20 p-2">
        <Text className="text-white/80 text-xs font-bold">
          #{pokemon.pokedex_number.toString().padStart(3, "0")}
        </Text>

        <Text className="text-white text-xl font-bold capitalize">
          {pokemon.mote || pokemon.name}
        </Text>
      </View>
    </GlobalButton>
  );
};

export default PokemonCard;
