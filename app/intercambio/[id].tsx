import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import GlobalButton from "@/components/GlobalButton";
import axiosInstance from "api/axiosInstance";
import { secureStore } from "functions/secureStore";
import { pokemonSprite } from "functions/helpers";
import PokemonDropdown from "@/components/PokemonDropdown";

export default function Intercambio() {
  const { id: friendId } = useLocalSearchParams();
  const router = useRouter();

  const [myPokemon, setMyPokemon] = useState([]);
  const [friendPokemon, setFriendPokemon] = useState([]);

  const [selectedMine, setSelectedMine] = useState(null);
  const [selectedTheirs, setSelectedTheirs] = useState(null);
  const [openMine, setOpenMine] = useState(false);
  const [openTheirs, setOpenTheirs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myOutgoingTrades, setMyOutgoingTrades] = useState([]);
  const lockedIds = myOutgoingTrades.map((t) => t.requester_pokemon_id);
  const myPokemonWithLock = myPokemon.map((p) => ({
    ...p,
    locked: lockedIds.includes(p.id),
  }));
  const availablePokemon = myPokemon.filter((p) => !lockedIds.includes(p.id));

  useEffect(() => {
    const loadMyTrades = async () => {
      const token = await secureStore.getItem("accessToken");

      const { data } = await axiosInstance.get("/trade/my_requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyOutgoingTrades(data);
    };

    loadMyTrades();
  }, []);

  // Cargar Pokémon propios y del amigo
  useEffect(() => {
    const load = async () => {
      try {
        const token = await secureStore.getItem("accessToken");

        const myRes = await axiosInstance.get("/pokemon/users_pokemon", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const friendRes = await axiosInstance.get(
          `/pokemon/public_users_pokemon/${friendId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMyPokemon(myRes.data);
        setFriendPokemon(friendRes.data);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "No se pudieron cargar los Pokémon.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sendTrade = async () => {
    if (!selectedMine || !selectedTheirs) {
      return Alert.alert("Error", "Selecciona un Pokémon de cada lado.");
    }

    if (lockedIds.includes(selectedMine.id)) {
      return Alert.alert(
        "Pokémon no disponible",
        "Este Pokémon ya está involucrado en otro intercambio pendiente."
      );
    }

    try {
      const token = await secureStore.getItem("accessToken");

      await axiosInstance.post(
        "/trade/send",
        {
          friend_id: friendId,
          requester_pokemon_id: selectedMine.id,
          receiver_pokemon_id: selectedTheirs.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Éxito", "Solicitud de intercambio enviada.");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo enviar la solicitud.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-red-800">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-red-800 p-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-black rounded-full justify-center items-center border border-red-500"
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold">Intercambio</Text>

        <View className="w-10" />
      </View>

      {/* Caja principal */}
      <View className="bg-black border-2 border-red-600 rounded-3xl p-5">
        <PokemonDropdown
          label="Tú ofreces:"
          data={myPokemonWithLock}
          selected={selectedMine}
          open={openMine}
          setOpen={setOpenMine}
          onSelect={setSelectedMine}
        />

        {/* BOTÓN CENTRAL — Confirmar Intercambio */}
        <View className="my-6">
          <TouchableOpacity
            onPress={sendTrade}
            className="flex-row items-center justify-center bg-red-800 rounded-2xl px-4 py-3"
          >
            {/* Ícono */}
            <Feather name="refresh-cw" size={45} color="#fff" />

            {/* Texto */}
            <Text className="text-white font-bold text-lg ml-3">
              Solicitar intercambio
            </Text>
          </TouchableOpacity>
        </View>

        <PokemonDropdown
          label="A cambio de:"
          data={friendPokemon}
          selected={selectedTheirs}
          open={openTheirs}
          setOpen={setOpenTheirs}
          onSelect={setSelectedTheirs}
        />
      </View>
    </SafeAreaView>
  );
}
