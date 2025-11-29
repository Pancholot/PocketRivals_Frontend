import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePokemon } from "contexts/PokemonContext";
import PokemonCard from "@/components/PokemonCard";
import { secureStore } from "functions/secureStore";
import axiosInstance from "api/axiosInstance";
import { useUser } from "contexts/UserContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const PokemonParty = () => {
  const { setMyPokemon, myPokemon } = usePokemon();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const gettingPokemon = async () => {
        try {
          setIsLoading(true);

          const token = await secureStore.getItem("accessToken");

          const { data } = await axiosInstance.get(`/pokemon/users_pokemon`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const ordered = data.sort(
            (a, b) =>
              new Date(b.obtained_at).getTime() -
              new Date(a.obtained_at).getTime()
          );

          if (isActive) setMyPokemon(ordered);
        } catch (error) {
          console.log("Error cargando Pokémon:", error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      gettingPokemon();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <SafeAreaView className="flex items-center bg-red-800 h-full w-full">
      <Text className="text-2xl font-extrabold mt-2 text-white">
        Pokémon Capturados
      </Text>

      {isLoading ? (
        <Text className="text-white mt-4">Cargando...</Text>
      ) : (
        <FlatList
          numColumns={1}
          data={myPokemon}
          keyExtractor={(item) => item.id}
          className="h-full w-full"
          renderItem={({ item }) => {
            return <PokemonCard pokemon={item} />;
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default PokemonParty;
