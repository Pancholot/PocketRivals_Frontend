import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { pokemonSprite } from "functions/helpers";

export default function PokemonDropdown({
  label,
  data,
  selected,
  open,
  setOpen,
  onSelect,
}) {
  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="text-red-500 mb-1 text-xs uppercase tracking-widest font-bold">
        {label}
      </Text>

      {/* Botón */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="bg-[#111] border border-red-900/50 p-4 rounded-2xl flex-row items-center justify-between"
      >
        <Text className="text-white font-bold">
          {selected ? selected.mote || selected.name : "Seleccionar Pokémon"}
        </Text>

        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
        <View className="bg-black border border-red-900/50 rounded-2xl mt-2 max-h-64">
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 250 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.locked) {
                    Alert.alert(
                      "Pokémon no disponible",
                      "Este Pokémon ya está involucrado en otro intercambio pendiente."
                    );
                    return;
                  }

                  onSelect(item);
                  setOpen(false);
                }}
                className={`flex-row items-center p-3 border-b border-red-950/40 ${
                  item.locked ? "opacity-40" : ""
                }`}
              >
                <Image
                  source={{ uri: pokemonSprite(item.pokedex_number) }}
                  className="w-10 h-10 mr-3"
                />

                <View>
                  <Text className="text-white font-bold capitalize">
                    {item.mote || item.name}
                  </Text>
                  <Text className="text-red-400 text-xs">ID: {item.id}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
