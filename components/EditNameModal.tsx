import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import GlobalButton from "./GlobalButton";

interface EditNameModalProps {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function EditNameModal({
  visible,
  currentName,
  onClose,
  onSave,
}: EditNameModalProps) {
  const [name, setName] = useState(currentName);

  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/70 items-center justify-center px-6 z-50">
      <View className="bg-white w-full max-w-xs p-6 rounded-3xl border-2 border-red-600">
        <Text className="text-black text-xl font-bold mb-4 text-center">
          Editar Nombre
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          className="border-2 border-red-600 rounded-xl px-3 py-2 text-black text-lg mb-4"
          placeholder="Nuevo nombre"
          placeholderTextColor="#999"
        />

        {/* Botones */}
        <View className="flex-row justify-between mt-2">
          <GlobalButton
            onPress={onClose}
            className="bg-gray-300 px-4 py-2 rounded-xl"
          >
            <Text className="text-black font-bold">Cancelar</Text>
          </GlobalButton>

          <GlobalButton
            onPress={() => {
              const clean = name.trim();
              if (clean.length > 0) onSave(clean);
              onClose();
            }}
            className="bg-red-700 px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-bold">Guardar</Text>
          </GlobalButton>
        </View>
      </View>
    </View>
  );
}
