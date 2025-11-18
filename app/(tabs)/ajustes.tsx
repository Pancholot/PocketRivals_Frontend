import { View, Text, Image, Alert } from "react-native";
import QRCode from "@/components/QRCode";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import ScanQR from "@/components/scanQR";
import { useMusic } from "contexts/MusicContext";
import { useRouter } from "expo-router";
import EditNameModal from "@/components/EditNameModal";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalButton from "@/components/GlobalButton";

const ajustes = () => {
  const userId = "12345";
  const [username, setUsername] = useState("AshKetchum");
  const [editingName, setEditingName] = useState(false);

  const profileImage = require("@/assets/icons/profilePic.png");
  const [showScanner, setShowScanner] = useState(false);
  const { isPlaying, playMusic, stopMusic } = useMusic();
  const router = useRouter();

  const copyIDToClipboard = async () => {
    Clipboard.setStringAsync(userId);
    Alert.alert("¡Copiado!", "Tu ID ha sido copiado al portapapeles.");
  };
  return (
    <SafeAreaView className="flex-1 bg-red-800 pt-16">
      <View className="flex-1 items-center justify-start bg-red-800 px-6">
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
          <GlobalButton
            className="border bg-black border-red-600 px-4 py-2 rounded-xl"
            onPress={() => {
              stopMusic();
              router.replace("/");
            }}
          >
            <Text className="text-red-600 font-semibold">Cerrar Sesión</Text>
          </GlobalButton>
        </View>

        {/* Código QR */}
        <View className="w-72 h-72 rounded-3xl overflow-hidden border-4 border-white items-center justify-center mb-4">
          <QRCode value={`${userId}`} />
        </View>

        {/* Nombre de Usuario */}
        <View className="items-center mb-5 flex-row">
          <Text className="text-white text-xl font-bold mr-2">{username}</Text>

          <GlobalButton onPress={() => setEditingName(true)}>
            <Feather name="edit" size={22} color="white" />
          </GlobalButton>
        </View>

        {/* Modal de edición */}
        <EditNameModal
          visible={editingName}
          currentName={username}
          onClose={() => setEditingName(false)}
          onSave={(newName) => {
            setUsername(newName);
            setEditingName(false);
          }}
        />

        {/* ID y para Copiar la misma */}
        <View className="flex-row items-center mb-4">
          <View className="bg-black border border-red-600 px-5 py-3 rounded-2xl mr-3 items-center">
            <Text className="text-red-600 font-semibold mt-1">
              ID: {userId}
            </Text>
          </View>
          <GlobalButton
            onPress={copyIDToClipboard}
            className="w-10 h-10 items-center justify-center p-0"
          >
            <Feather name="copy" size={32} color="white" />
          </GlobalButton>
        </View>

        {/* Botón Música */}
        <GlobalButton
          onPress={() => {
            if (isPlaying) stopMusic();
            else playMusic();
          }}
          className="bg-black border border-red-600 w-56 py-3 rounded-xl mt-4"
        >
          <Text className="text-center text-red-600 font-bold">
            {isPlaying ? "Pausar Música" : "Prender Música"}
          </Text>
        </GlobalButton>

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
    </SafeAreaView>
  );
};

export default ajustes;
