import { View, Text, Image, Alert } from "react-native";
import QRCode from "@/components/QRCode";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
  }, []);

  if (!user) {
    return <Text style={{ color: "white", marginTop: 50 }}>Cargando...</Text>;
  }

  // Ahora sí user existe
  const username = user.username;
  const userId = user.id;
  const shortId = `${userId.slice(0, 4)}...${userId.slice(-4)}`;
  const { isPlaying, playMusic, stopMusic } = useMusic();
  const router = useRouter();

  const [editingName, setEditingName] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const avatarMap: Record<string, any> = {
    "Greninja.png": require("@/assets/icons/Greninja.png"),
    "Kabutops.png": require("@/assets/icons/Kabutops.png"),
    "Kingler.png": require("@/assets/icons/Kingler.png"),
    "default.png": require("@/assets/icons/default.png"),
    "Psyduck.png": require("@/assets/icons/Psyduck.png"),
    "Wooper.png": require("@/assets/icons/Wooper.png"),
  };

  const avatarOptions = [
    require("@/assets/icons/Greninja.png"),
    require("@/assets/icons/Kabutops.png"),
    require("@/assets/icons/Kingler.png"),
    require("@/assets/icons/default.png"),
    require("@/assets/icons/Psyduck.png"),
    require("@/assets/icons/Wooper.png"),
  ];

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

      setUser((prev) => ({ ...prev, username: newUsername }));
      Alert.alert("Éxito", "Tu nombre de usuario ha sido actualizado.");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo actualizar el usuario."
      );
    }
  };

  const updateProfilePicture = async (newPicture: string) => {
    try {
      const token = await secureStore.getItem("accessToken");

      // Actualiza la foto de perfil en el backend
      await axiosInstance.put(
        "/player/change_profile_picture",
        { profile_picture: newPicture },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => ({ ...prev, profile_picture: newPicture }));

      Alert.alert("Éxito", "Tu foto de perfil ha sido actualizada.");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo actualizar la foto."
      );
    }
  };

  console.log("DEBUG FOTO AJUSTES:", user?.profile_picture);

  const profileKey = user?.profile_picture ?? "default.png";
  const profileImage = avatarMap[profileKey] || avatarMap["default.png"];

  console.log("USER CONTEXT:", user);
  console.log("DEBUG FOTO AJUSTES KEY:", profileKey);
  console.log("DEBUG FOTO AJUSTES IMG:", profileImage);

  return (
    <SafeAreaView className="flex-1 bg-red-800 pt-16">
      <View className="flex-1 items-center justify-start bg-red-800 px-6">
        <View className="w-full flex-row justify-between items-center mb-16">
          <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center">
            {/* FOTO DE PERFIL */}
            <GlobalButton onPress={() => setShowAvatarPicker(true)}>
              <Image
                source={profileImage}
                className="ml-10 w-36 h-36 rounded-full border-4 border-black"
                resizeMode="contain"
              />
            </GlobalButton>
          </View>

          {/* LOGOUT */}
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

        {/* QR */}
        <View className="w-72 h-72 rounded-3xl overflow-hidden border-4 border-white items-center justify-center mb-4">
          {userId ? (
            <QRCode value={userId} />
          ) : (
            <Text className="text-white">Cargando ID...</Text>
          )}
        </View>

        {/* NOMBRE */}
        <View className="items-center mb-5 flex-row">
          <Text className="text-white text-xl font-bold mr-2">{username}</Text>

          <GlobalButton onPress={() => setEditingName(true)}>
            <Feather name="edit" size={22} color="white" />
          </GlobalButton>
        </View>

        <EditNameModal
          visible={editingName}
          currentName={username}
          onClose={() => setEditingName(false)}
          onSave={(newName) => {
            updateUsername(newName);
            setEditingName(false);
          }}
        />

        {/* ID */}
        <View className="flex-row items-center mb-4 pl-6">
          <View className="bg-black border border-red-600 px-5 py-3 rounded-2xl mr-3 items-center">
            <Text className="text-red-600 font-semibold mt-1">
              ID: {shortId}
            </Text>
          </View>

          <GlobalButton
            onPress={async () => {
              await Clipboard.setStringAsync(user?.id);
              Alert.alert("Copiado", "El ID ha sido copiado al portapapeles.");
            }}
            className="w-10 h-10 items-center justify-center p-0"
          >
            <Feather name="copy" size={32} color="white" />
          </GlobalButton>
        </View>

        {/* BOTÓN MÚSICA */}
        <GlobalButton
          onPress={() => (isPlaying ? stopMusic() : playMusic())}
          className="bg-black border border-red-600 w-56 py-3 rounded-xl mt-4"
        >
          <Text className="text-center text-red-600 font-bold">
            {isPlaying ? "Pausar Música" : "Prender Música"}
          </Text>
        </GlobalButton>
      </View>

      {/* POP-OFF SELECCIÓN DE AVATAR */}
      {showAvatarPicker && (
        <View className="absolute inset-0 bg-black/60 justify-center items-center z-50 px-10">
          <View className="bg-black border-2 border-red-600 rounded-3xl w-96 py-6 px-6">
            <Text className="text-white text-xl font-bold text-center mb-6">
              Selecciona tu foto de perfil
            </Text>

            <View className="flex-row flex-wrap justify-center gap-4 mb-4">
              {avatarOptions.map((avatar, index) => (
                <GlobalButton
                  key={index}
                  onPress={() => {
                    const avatarNames = [
                      "Greninja.png",
                      "Kabutops.png",
                      "Kingler.png",
                      "default.png",
                      "Psyduck.png",
                      "Wooper.png",
                    ];

                    const selectedPicture = avatarNames[index];
                    updateProfilePicture(selectedPicture);
                    setShowAvatarPicker(false);
                  }}
                  className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-700"
                >
                  <Image
                    source={avatar}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                </GlobalButton>
              ))}
            </View>

            <GlobalButton
              onPress={() => setShowAvatarPicker(false)}
              className="bg-red-800 border border-red-600 w-full py-3 rounded-xl mt-4"
            >
              <Text className="text-center text-white font-bold text-lg">
                Cerrar
              </Text>
            </GlobalButton>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
