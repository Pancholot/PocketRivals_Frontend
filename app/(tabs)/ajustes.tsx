import { View, Text, Image, Alert } from "react-native";
import QRCode from "@/components/QRCode";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import ScanQR from "@/components/scanQR";
import { useMusic } from "contexts/MusicContext";
import { useRouter } from "expo-router";
import EditNameModal from "@/components/EditNameModal";
import { SafeAreaView } from "react-native-safe-area-context";
import GlobalButton from "@/components/GlobalButton";
import { logout } from "api/apiService";
import { secureStore } from "functions/secureStore";
import axiosInstance from "api/axiosInstance";
import { useUser } from "contexts/UserContext";

export default function Ajustes() {
  const { user, setUser, loadUserFromToken } = useUser();
  useEffect(() => {
    if (!user) {
      loadUserFromToken();
    }
  }, [user]);

  const username = user?.username ?? "";
  const [editingName, setEditingName] = useState(false);

  const userId = user?.id ?? "";
  const shortId = userId ? `${userId.slice(0, 4)}...${userId.slice(-4)}` : "";

  const profileImage = require("@/assets/icons/profilePic.png");
  const { isPlaying, playMusic, stopMusic } = useMusic();
  const router = useRouter();

  const updateUsername = async (newUsername: string) => {
    try {
      const token = await secureStore.getItem("accessToken");

      await axiosInstance.put(
        "/player/change_username",
        { username: newUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Actualizar el contexto del usuario
      setUser((prev) => ({ ...prev, username: newUsername }));

      Alert.alert("Éxito", "Tu nombre de usuario ha sido actualizado.");
    } catch (error: any) {
      console.error("Error actualizando username:", error);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo actualizar el usuario."
      );
    }
  };

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
              try {
                logout();
                stopMusic();
                router.replace("/");
              } catch (error) {
                Alert.alert("Error", "Error al cerrar sesión");
              }
            }}
          >
            <Text className="text-red-600 font-semibold">Cerrar Sesión</Text>
          </GlobalButton>
        </View>

        {/* Código QR */}
        <View className="w-72 h-72 rounded-3xl overflow-hidden border-4 border-white items-center justify-center mb-4">
          {userId && userId.length > 0 ? (
            <QRCode value={userId} />
          ) : (
            <Text className="text-white">Cargando ID...</Text>
          )}
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
            updateUsername(newName);
            setEditingName(false);
          }}
        />

        {/* ID y para Copiar la misma */}
        <View className="flex-row items-center mb-4 pl-6">
          <View className="bg-black border border-red-600 px-5 py-3 rounded-2xl mr-3 items-center">
            <Text className="text-red-600 font-semibold mt-1">
              ID: {shortId}
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
      </View>
    </SafeAreaView>
  );
}
