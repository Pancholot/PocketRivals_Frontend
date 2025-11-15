import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import QRCode from "@/components/QRCode";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import ScanQR from "@/components/scanQR";
import { useMusic } from "@/components/MusicContext";
import { useRouter } from "expo-router";

const ajustes = () => {
  const userId = "12345";
  const username = "AshKetchum";
  const profileImage = require("@/assets/icons/profilePic.png");
  const [showScanner, setShowScanner] = useState(false);
  const { isPlaying, playMusic, stopMusic } = useMusic();
  const router = useRouter();

  const copyIDToClipboard = async () => {
    Clipboard.setStringAsync(userId);
    Alert.alert("¡Copiado!", "Tu ID ha sido copiado al portapapeles.");
  };
  return (
    <View className="flex-1 items-center justify-start bg-red-800 pt-32 px-6">
      <View className="w-full flex-row justify-between items-center mb-16">
        <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center">
          {/* Foto de Perfil */}
          <Image
            source={profileImage}
            className="ml-10 w-36 h-36 rounded-full border-4 border-black"
            resizeMode="contain"
          />
        </View>

        {/* Log out */}
        <TouchableOpacity
          className="border bg-black border-red-600 px-4 py-2 rounded-xl"
          onPress={() => router.replace("/")}
        >
          <Text className="text-red-600 font-semibold">Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Código QR */}
      <View className="w-72 h-72 rounded-3xl overflow-hidden border-4 border-white items-center justify-center mb-4">
        <QRCode value={`${userId}`} />
      </View>

      {/* Nombre de Usuario */}
      <View className="items-center mb-5">
        <Text className="text-white text-xl font-bold">{username}</Text>
      </View>

      {/* ID y para Copiar la misma */}
      <View className="flex-row items-center mb-4">
        <View className="bg-black border border-red-600 px-5 py-3 rounded-2xl mr-3 items-center">
          <Text className="text-red-600 font-semibold mt-1">ID: {userId}</Text>
        </View>
        <TouchableOpacity
          onPress={copyIDToClipboard}
          className="w-10 h-10 items-center justify-center p-0"
        >
          <Feather name="copy" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Botón Cámara */}
      <TouchableOpacity
        onPress={() => setShowScanner(true)}
        className="w-64 bg-black border-2 border-red-600 rounded-3xl px-6 py-4 flex-row items-center justify-center"
      >
        <Feather
          name="camera"
          size={22}
          color="red"
          style={{ marginRight: 10 }}
        />
        <Text className="text-red-600 text-lg font-bold">Abrir Scanner</Text>
      </TouchableOpacity>

      {/* Botón Música */}
      <TouchableOpacity
        onPress={() => {
          if (isPlaying) stopMusic();
          else playMusic();
        }}
        className="bg-black border border-red-600 w-56 py-3 rounded-xl mt-4"
      >
        <Text className="text-center text-red-600 font-bold">
          {isPlaying ? "Apagar Música" : "Prender Música"}
        </Text>
      </TouchableOpacity>

      {showScanner && (
        <View className="absolute inset-0 bg-black/80 z-50 flex-1">
          <ScanQR
            onScanned={(value) => {
              alert("QR data: " + value);
            }}
            onClose={() => setShowScanner(false)}
          />
        </View>
      )}
    </View>
  );
};

export default ajustes;
