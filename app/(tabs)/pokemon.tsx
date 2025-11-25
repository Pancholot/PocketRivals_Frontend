import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokemon } from "contexts/PokemonContext";
import PokemonCard from "@/components/PokemonCard";
import { secureStore } from "functions/secureStore";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import axios from "axios";
import axiosInstance from "api/axiosInstance";
import { useUser } from "contexts/UserContext";

const PokemonParty = () => {
  const { setMyPokemon, myPokemon } = usePokemon();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();

  useEffect(() => {
    try {
      setIsLoading(true);
      const gettingPokemon = async () => {
        const token = await secureStore.getItem("accessToken");
        const { data } = await axiosInstance.get(`/pokemon/users_pokemon`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMyPokemon(data);
      };

      gettingPokemon();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SafeAreaView className="flex items-center bg-red-800 h-full w-full">
      <Text className="text-2xl font-extrabold mt-2 text-white">
        Pokémon Capturados
      </Text>

      {isLoading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          numColumns={1}
          data={myPokemon}
          keyExtractor={(item) => item.id}
          className="h-full w-full"
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default PokemonParty;
