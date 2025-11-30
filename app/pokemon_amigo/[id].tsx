import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "@/components/PokemonCard";
import { secureStore } from "functions/secureStore";
import axiosInstance from "api/axiosInstance";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PokemonAmigo() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [pokemonAmigo, setPokemonAmigo] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadFriendPokemon = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = await secureStore.getItem("accessToken");

      const { data } = await axiosInstance.get(
        `/pokemon/public_users_pokemon/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.length > 0) {
        setFriendName(data[0].owner);
      }

      const ordered = data.sort(
        (a, b) =>
          new Date(b.obtained_at).getTime() - new Date(a.obtained_at).getTime()
      );

      setPokemonAmigo(
        ordered.map((p) => ({
          ...p,
          type1: p.type1,
        }))
      );
    } catch (error) {
      console.log("Error cargando Pokémon del amigo:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadFriendPokemon();
  }, [loadFriendPokemon]);

  return (
    <SafeAreaView className="flex items-center bg-red-800 h-full w-full">
      {/* TÍTULO */}
      <Text className="text-2xl font-extrabold mt-2 text-white">
        Pokémon de {friendName || "..."}
      </Text>

      {/* CONTENIDO */}
      {isLoading ? (
        <Text className="text-white mt-4">Cargando...</Text>
      ) : pokemonAmigo.length === 0 ? (
        <Text className="text-white mt-4">
          Este entrenador no tiene Pokémon capturados.
        </Text>
      ) : (
        <FlatList
          numColumns={1}
          data={pokemonAmigo}
          keyExtractor={(item) => item.id}
          className="h-full w-full"
          renderItem={({ item }) => (
            <PokemonCard pokemon={{ ...item, friendId: id }} />
          )}
        />
      )}
      {/* BOTÓN CERRAR */}
      <View className="w-full items-center">
        <View className="mt-3 mb-4">
          <View className="bg-red-800 border border-red-600 rounded-xl overflow-hidden">
            <Text
              onPress={() => router.back()}
              className="text-center text-white font-bold text-lg py-2 px-8"
            >
              Cerrar
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
