import { View, Text, Image, ScrollView, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import ScanQR from "@/components/scanQR";
import { useRouter } from "expo-router";
import { useFriendRequests } from "contexts/useFriendRequests";
import { useFriends } from "contexts/useFriends";
import GlobalButton from "@/components/GlobalButton";
import { secureStore } from "functions/secureStore";
import axiosInstance from "api/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useTradeRequests } from "contexts/useTradeRequests";
import { useTradeNotif } from "contexts/useTradeNotifications";
import { useWebSocket } from "@/contexts/WebSocketContext";

export default function Amigos() {
  const [showAddBox, setShowAddBox] = useState(false);
  const [friendId, setFriendId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const router = useRouter();
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  const { requests, setRequests } = useFriendRequests();
  const { tradeRequests, setTradeRequests } = useTradeRequests();
  const [isLoading, setIsLoading] = useState(true);

  const { friends, setFriends } = useFriends();

  const confirmDelete = (friendId: string) => {
    Alert.alert("Eliminar amigo", "¿Seguro que deseas eliminar a este amigo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => removeFriend(friendId),
      },
    ]);
  };

  useEffect(() => {
    const gettingRequests = async () => {
      try {
        setIsLoading(true);

        const token = await secureStore.getItem("accessToken");

        console.log({
          requests,
          tradeRequests,
        });

        //Solicitudes de amistad
        const { data: friendReqs } = await axiosInstance.get(
          `/friends/check_requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(friendReqs);

        //Solicitudes de intercambio
        const { data: tradeReqs } = await axiosInstance.get(
          `/trade/pending_requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTradeRequests(tradeReqs);
      } catch (error) {
        console.log("Error cargando solicitudes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    gettingRequests();
  }, []);

  const removeFriend = async (friendId: string) => {
    try {
      const token = await secureStore.getItem("accessToken");

      await axiosInstance.delete("/friends/remove", {
        data: { friend_id: friendId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFriends((prev) => prev.filter((f) => f.id !== friendId));

      Alert.alert("Listo", "Amigo eliminado correctamente.");
    } catch (error) {
      console.log("Error eliminando amigo:", error);
      Alert.alert("Error", "No se pudo eliminar al amigo.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadFriends = async () => {
        try {
          const token = await secureStore.getItem("accessToken");
          const { data } = await axiosInstance.get(`/friends/list`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (isActive) setFriends(data.friends);
        } catch (error) {
          console.log("Error cargando amigos:", error);
        }
      };

      loadFriends();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const sendFriendRequest = (idValue: string) => {
    const gettingRequests = async () => {
      try {
        console.log(idValue);
        const token = await secureStore.getItem("accessToken");
        const request = await axiosInstance.post(
          `/friends/send_request`,
          {
            receiver_id: idValue,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        router.replace("/amigos");
        Alert.alert(
          "Enviado con éxito",
          "Se ha mandado la solicitud de amistad."
        );
        setFriendId("");
        setShowAddBox(false);
        setShowScanner(false);
      } catch (error: any) {
        const raw = error?.response?.data?.message?.toLowerCase() || "";

        // Detectar solicitudes duplicadas
        if (
          raw.includes("1062") ||
          raw.includes("duplicate") ||
          raw.includes("entry")
        ) {
          Alert.alert(
            "Solicitud pendiente",
            "Ya has enviado una solicitud a este usuario."
          );

          setFriendId("");
          return;
        }

        Alert.alert("Error", "Ha ocurrido un error ):");
      }
    };

    gettingRequests();
  };

  return (
    <View className="flex-1 bg-red-800 pt-20 px-5">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-white text-2xl font-bold">Lista de Amigos</Text>

        <GlobalButton
          className="bg-black border border-red-600 p-4 rounded-full overflow-visible"
          onPress={() => router.push("/solicitudes")}
        >
          <Text className="text-red-600 font-semibold">
            <Feather name="bell" size={26} />
          </Text>
          {requests.length + tradeRequests.length > 0 && (
            <View className="absolute -top-2 -right-2 bg-yellow-500 h-7 w-7 rounded-full items-center justify-center">
              <Text className="text-black font-bold text-base leading-none">
                {requests.length + tradeRequests.length}
              </Text>
            </View>
          )}
        </GlobalButton>
      </View>

      {/* FRIEND LIST */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {isLoading ? (
          <Text className="text-white text-center mt-4 text-lg">
            Cargando amigos...
          </Text>
        ) : friends.length === 0 ? (
          <Text className="text-white text-center mt-4 text-lg">
            No tienes amigos
          </Text>
        ) : (
          friends.map((f) => {
            const shortId = f.id
              ? `${f.id.slice(0, 4)}...${f.id.slice(-4)}`
              : "";

            return (
              <View
                key={f.id}
                className="bg-black border border-red-600 rounded-3xl px-4 py-4 mb-4 flex-row justify-between items-center"
              >
                {/* IZQUIERDA */}
                <View className="flex-row items-center">
                  <Image
                    source={{
                      uri:
                        f.img ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUSeONpWEdtwCAskidQnoPr7sAHmNWmbnnHw&s",
                    }}
                    className="w-16 h-16 rounded-full border-2 border-red-600 mr-4"
                  />

                  <View>
                    <Text className="text-white text-lg font-bold">
                      {f.username}
                    </Text>
                    <Text className="text-gray-500 text-sm font-bold">
                      {shortId}
                    </Text>
                    <Text className="text-red-600">
                      Último capturado: {f.last_captured}
                    </Text>
                  </View>
                </View>

                {/* MENÚ */}
                <GlobalButton
                  onPress={() => setSelectedFriend(f)}
                  className="w-10 h-10 bg-transparent items-center justify-center"
                >
                  <Feather name="menu" size={26} color="#fff" />
                </GlobalButton>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* BOTÓN AGREGAR AMIGO */}
      <View className="absolute bottom-6 left-5 right-5">
        <GlobalButton
          onPress={() => setShowAddBox(true)}
          className="bg-black border-2 border-red-600 rounded-2xl py-4 items-center"
        >
          <Text className="text-red-600 font-bold text-lg">Agregar Amigo</Text>
        </GlobalButton>
      </View>

      {/* Modal de Agregar Amigo */}
      {showAddBox && (
        <View className="absolute inset-0 bg-black/70 justify-center items-center px-8 z-50">
          <View className="bg-black py-10 px-8 rounded-3xl border-2 border-red-600 w-full items-center">
            {/* Botón de Escáner */}
            <GlobalButton
              onPress={() => setShowScanner(true)}
              className="w-80 bg-red-800 border-2 border-red-600 rounded-3xl px-6 py-4 flex-row items-center justify-center mb-6"
            >
              <Feather
                name="camera"
                size={22}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold text-lg">Escanear QR</Text>
            </GlobalButton>

            <Text className="text-white font-bold text-lg mb-4">o</Text>

            {/* Input para ID manual */}
            <TextInput
              className="bg-white w-80 px-4 py-3 rounded-xl text-black mb-4"
              placeholder="Ingresar ID"
              placeholderTextColor="#666"
              value={friendId}
              onChangeText={setFriendId}
            />

            {/* Botón Confirmar */}
            <GlobalButton
              onPress={() => sendFriendRequest(friendId)}
              className="bg-red-800 border border-red-600 w-80 py-3 rounded-xl mb-3"
            >
              <Text className="text-center text-white font-bold text-lg">
                Agregar
              </Text>
            </GlobalButton>

            {/* Cerrar */}
            <GlobalButton onPress={() => setShowAddBox(false)}>
              <Text className="text-red-600 font-bold text-lg mt-2">
                Cerrar
              </Text>
            </GlobalButton>
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

      {/* MENU DE OPCIONES */}
      {selectedFriend && (
        <View className="absolute inset-0 bg-black/60 justify-center items-center z-50 px-10">
          <View className="bg-black border-2 border-red-600 rounded-3xl w-96 py-6 px-6">
            {/* TÍTULO */}
            <Text className="text-white text-xl font-bold text-center mb-4">
              Opciones de {selectedFriend.username}
            </Text>

            {/* Ver Pokémon */}
            <GlobalButton
              className="py-3 flex-row items-center gap-3 border-b border-red-700"
              onPress={() => {
                router.push(`/pokemon_amigo/${selectedFriend.id}`);
                setSelectedFriend(null);
              }}
            >
              <Feather name="eye" size={22} color="white" />
              <Text className="text-white text-lg font-bold">Ver Pokémon</Text>
            </GlobalButton>

            {/* Intercambiar */}
            <GlobalButton
              className="py-3 flex-row items-center gap-3 border-b border-red-700"
              onPress={() => {
                router.push(`/intercambio/${selectedFriend.id}`);
                setSelectedFriend(null);
              }}
            >
              <Feather name="repeat" size={22} color="white" />
              <Text className="text-white text-lg font-bold">Intercambiar</Text>
            </GlobalButton>

            {/* Eliminar */}
            <GlobalButton
              className="py-3 flex-row items-center gap-3"
              onPress={() => {
                confirmDelete(selectedFriend.id);
                setSelectedFriend(null);
              }}
            >
              <Feather name="trash-2" size={22} color="#ff4444" />
              <Text className="text-red-500 text-lg font-bold">Eliminar</Text>
            </GlobalButton>

            {/* Botón cerrar */}
            <GlobalButton
              onPress={() => setSelectedFriend(null)}
              className="bg-red-800 border border-red-600 w-full py-3 rounded-xl mt-6"
            >
              <Text className="text-center text-white font-bold text-lg">
                Cerrar
              </Text>
            </GlobalButton>
          </View>
        </View>
      )}
    </View>
  );
}
