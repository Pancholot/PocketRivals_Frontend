import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import ScanQR from "@/components/scanQR";
import IntroAnimeAd from "@/components/IntroAnimeAd";
import { useRouter } from "expo-router";
import { useFriendRequests } from "hooks/useFriendRequests";
import { useFriends } from "hooks/useFriends";

export default function Amigos() {
  const [showAddBox, setShowAddBox] = useState(false);
  const [friendId, setFriendId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();
  const { addRequest } = useFriendRequests();
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  const { friends } = useFriends();

  const sendFriendRequest = (idValue: string) => {
    if (!idValue.trim()) return;

    if (isProcessingScan) return;
    setIsProcessingScan(true);

    const newRequest = {
      id: Date.now(),
      name: "Entrenador",
      realId: idValue,
      img: require("@/assets/icons/profilePic.png"),
    };

    addRequest(newRequest);

    setFriendId("");
    setShowAddBox(false);
    setShowScanner(false);
    router.push("/solicitudes");

    setTimeout(() => {
      setIsProcessingScan(false);
    }, 500);
  };

  return (
    <View className="flex-1 bg-red-800 pt-20 px-5">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-white text-2xl font-bold">Lista de Amigos</Text>

        <TouchableOpacity
          className="bg-black border border-red-600 px-4 py-2 rounded-xl"
          onPress={() => router.push("/solicitudes")}
        >
          <Text className="text-red-600 font-semibold">Solicitudes</Text>
        </TouchableOpacity>
      </View>

      {/* FRIEND LIST */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {friends.map((f) => (
          <View
            key={f.id}
            className="bg-black border border-red-600 rounded-3xl px-4 py-4 mb-4 flex-row items-center"
          >
            <Image
              source={f.img}
              className="w-16 h-16 rounded-full border-2 border-red-600 mr-4"
            />

            <View>
              {/* Nombre + ID */}
              <Text className="text-white text-lg font-bold">
                {f.name} ({f.realId})
              </Text>

              <Text className="text-red-600">
                Último capturado: {f.lastCatch}
              </Text>
            </View>
          </View>
        ))}

        {/* Botón de Agregar */}
        <TouchableOpacity
          onPress={() => setShowAddBox(true)}
          className="bg-black border-2 border-red-600 rounded-2xl py-4 items-center mt-2 mb-10"
        >
          <Text className="text-red-600 font-bold text-lg">Agregar Amigo</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Agregar Amigo */}
      {showAddBox && (
        <View className="absolute inset-0 bg-black/70 justify-center items-center px-8 z-50">
          <View className="bg-black py-10 px-8 rounded-3xl border-2 border-red-600 w-full items-center">
            {/* Botón de Escáner */}
            <TouchableOpacity
              onPress={() => setShowScanner(true)}
              className="w-96 bg-red-800 border-2 border-red-600 rounded-3xl px-6 py-4 flex-row items-center justify-center mb-6"
            >
              <Feather
                name="camera"
                size={22}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold text-lg">Escanear QR</Text>
            </TouchableOpacity>

            <Text className="text-white font-bold text-lg mb-4">o</Text>

            {/* Input para ID manual */}
            <TextInput
              className="bg-white w-96 px-4 py-3 rounded-xl text-black mb-4"
              placeholder="Ingresar ID"
              placeholderTextColor="#666"
              value={friendId}
              onChangeText={setFriendId}
            />

            {/* Botón Confirmar */}
            <TouchableOpacity
              onPress={() => sendFriendRequest(friendId)}
              className="bg-red-800 border border-red-600 w-96 py-3 rounded-xl mb-3"
            >
              <Text className="text-center text-white font-bold text-lg">
                Agregar
              </Text>
            </TouchableOpacity>

            {/* Cerrar */}
            <TouchableOpacity onPress={() => setShowAddBox(false)}>
              <Text className="text-red-600 font-bold text-lg mt-2">
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* QR SCANNER */}
      {showScanner && (
        <View className="absolute inset-0 bg-black/80 z-50">
          <ScanQR
            onScanned={(value) => sendFriendRequest(value)}
            onClose={() => setShowScanner(false)}
          />
        </View>
      )}
      <IntroAnimeAd />
    </View>
  );
}
