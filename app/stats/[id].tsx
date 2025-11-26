import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { pokemonSprite } from "functions/helpers";
import { get } from "functions/Fetch";
import { Audio, AVPlaybackStatus } from "expo-av";
import GlobalButton from "@/components/GlobalButton";
import EditNameModal from "@/components/EditNameModal";
import { Feather } from "@expo/vector-icons";
import { YOUR_POKEMON_DATA } from "functions/UI.utils";
import { usePokemon } from "contexts/PokemonContext";
import { secureStore } from "functions/secureStore";
import axiosInstance from "api/axiosInstance";

const PokemonStats = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [basePokemonData, setBasePokemonData] = useState<any>(null);

  const pokemonType = basePokemonData?.types?.[0]?.type?.name || "normal";
  const TYPE_COLORS: any = {
    normal: "#a8a878",
    fire: "#f08030",
    water: "#6890f0",
    electric: "#f8d030",
    grass: "#78c850",
    ice: "#98d8d8",
    fighting: "#c03028",
    poison: "#a040a0",
    ground: "#e0c068",
    flying: "#a890f0",
    psychic: "#f85888",
    bug: "#a8b820",
    rock: "#b8a038",
    ghost: "#705898",
    dragon: "#7038f8",
    dark: "#705848",
    steel: "#b8b8d0",
    fairy: "#ee99ac",
  };

  const [pokemonName, setPokemonName] = useState<string>("");
  const [editingName, setEditingName] = useState<boolean>(false);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { changeMote, myPokemon } = usePokemon();
  const numericId = Number(id);
  const ownedPokemon = myPokemon.find((p) => p.pokedex_number === numericId);

  const updateMote = async (newMote: string) => {
    try {
      if (!ownedPokemon) {
        Alert.alert("Error", "No encontramos a este Pokémon en tu lista.");
        return;
      }

      const token = await secureStore.getItem("accessToken");

      await axiosInstance.put(
        "/pokemon/change_mote",
        {
          pokemon_id: ownedPokemon.id,
          mote: newMote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      changeMote(ownedPokemon.pokedex_number, newMote);
    } catch (error) {
      console.error("Error actualizando mote:", error);
      Alert.alert("Error", "No se pudo actualizar el mote.");
    }
  };

  // --- Lógica de Audio ---
  const playCry = async (cryUrl: string) => {
    try {
      if (!cryUrl) return;
      const { sound } = await Audio.Sound.createAsync(
        { uri: cryUrl },
        { shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate(async (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error reproduciendo sonido:", error);
    }
  };

  // --- Lógica de Carga ---
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      const resultado = await get(`https://pokeapi.co/api/v2/pokemon/${id}`);

      if (resultado) {
        setBasePokemonData(resultado);
        // Reproducir sonido solo si la carga fue exitosa
        if (resultado.cries) {
          playCry(resultado.cries.legacy || resultado.cries.latest);
        }
      } else {
        console.log("Error al cargar datos");
      }
      setLoading(false);
    };

    cargarDatos();
  }, [id]);

  useEffect(() => {
    if (ownedPokemon?.mote) {
      setPokemonName(ownedPokemon.mote);
    } else {
      setPokemonName("");
    }
  }, [ownedPokemon]);

  // --- 1. Vista de Carga ---
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#dc2626" />
        <Text className="mt-4 text-gray-500 font-medium">
          Cargando Pokémon...
        </Text>
      </SafeAreaView>
    );
  }

  const totalStats =
    basePokemonData?.stats?.reduce(
      (acc: number, s: any) => acc + (s.base_stat || 0),
      0
    ) || 0;

  // --- 2. Vista Principal ---
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: TYPE_COLORS[pokemonType] }}
    >
      <View className="absolute inset-0 bg-black/20" pointerEvents="none" />
      <EditNameModal
        visible={editingName}
        currentName={pokemonName}
        onClose={() => setEditingName(false)}
        onSave={(newName) => {
          setPokemonName(newName);
          updateMote(newName);
          setEditingName(false);
        }}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado con ID */}
        <View className="px-6 pt-4 flex-row justify-between items-center">
          <Text className="text-white font-bold text-xl">
            #{id?.toString().padStart(3, "0")}
          </Text>
        </View>

        {/* Imagen del Pokémon con Fondo Decorativo */}
        <View className="items-center justify-center mt-4 mb-8">
          {/* Círculo de fondo */}
          <View className="absolute w-72 h-72 bg-gray-200 rounded-full opacity-50" />
          <Pressable
            onPress={() => {
              playCry(
                basePokemonData.cries.legacy || basePokemonData.cries.latest
              );
            }}
          >
            <Image
              source={{ uri: pokemonSprite(id.toString()) }}
              className="w-64 h-64"
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Contenedor de Info */}
        <View className="px-6">
          {/* Nombre */}
          <View className="flex flex-row items-center justify-center gap-2 mb-2">
            <Text className="text-4xl font-extrabold text-black capitalize text-center">
              {pokemonName || basePokemonData?.name || "Desconocido"}
            </Text>

            <GlobalButton
              onPress={() => setEditingName(true)}
              className="h-10 w-10 items-center justify-center"
            >
              <Feather name="edit" size={26} color="black" />
            </GlobalButton>
          </View>

          {/* Tipos */}
          <View className="flex-row justify-center gap-3 mb-8">
            {basePokemonData?.types?.map((t: any, index: number) => {
              const type = t.type.name;
              const color = TYPE_COLORS[type];

              return (
                <View
                  key={index}
                  style={{
                    borderColor: color,
                    backgroundColor: "black",
                    borderWidth: 2,
                  }}
                  className="px-4 py-1.5 rounded-full"
                >
                  <Text
                    style={{ color }}
                    className="font-bold capitalize text-sm"
                  >
                    {type}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Sección de Estadísticas */}
          <View className="bg-black border-2 border-red-600 p-6 rounded-3xl shadow-xl mb-8">
            <Text className="text-2xl font-extrabold text-white mb-5">
              Estadísticas Base
            </Text>

            {basePokemonData?.stats?.map((stat: any, index: number) => {
              const percentage = Math.min((stat.base_stat / 150) * 100, 100);

              return (
                <View key={index} className="mb-4">
                  {/* Nombre + Valor */}
                  <View className="flex-row justify-between mb-1 px-1">
                    <Text className="text-white capitalize text-sm">
                      {stat.stat.name.replace("-", " ")}
                    </Text>

                    <Text className="text-white font-bold text-sm">
                      {stat.base_stat}
                    </Text>
                  </View>

                  {/* Barra */}
                  <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: "#ff3b30",
                      }}
                    />
                  </View>
                </View>
              );
            })}

            {/* TOTAL DE STATS */}
            <View>
              <View className="flex-row justify-between mb-1 px-1">
                <Text className="text-white font-bold text-base">Total</Text>
                <Text className="text-red-400 font-extrabold text-base">
                  {totalStats}
                </Text>
              </View>

              <View className="h-3 bg-white/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-red-600 rounded-full"
                  style={{
                    width: `${Math.min((totalStats / 700) * 100, 100)}%`,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón Regresar */}
      <View className="absolute bottom-0 left-0 right-0 ios:bg-white/80 bg-white ios:py-4 pb-12 pt-6 px-6">
        <GlobalButton
          className="bg-black w-full py-4 rounded-2xl shadow-md active:opacity-90"
          onPress={() => router.replace("/pokemon")}
        >
          <Text className="text-white font-bold text-center text-lg">
            Regresar a la lista
          </Text>
        </GlobalButton>
      </View>
    </SafeAreaView>
  );
};

export default PokemonStats;
