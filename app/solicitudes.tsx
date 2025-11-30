import { View, Text, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFriendRequests } from "contexts/useFriendRequests";
import GlobalButton from "@/components/GlobalButton";
import { secureStore } from "functions/secureStore";
import axiosInstance from "api/axiosInstance";
import { useTradeRequests } from "contexts/useTradeRequests";
import { useEffect } from "react";
import { useTradeNotif } from "contexts/useTradeNotifications";

export default function Solicitudes() {
  const router = useRouter();
  const { requests, setRequests } = useFriendRequests();
  const { tradeRequests, setTradeRequests } = useTradeRequests();

  useEffect(() => {
    const gettingRequests = async () => {
      try {
        const token = await secureStore.getItem("accessToken");

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
        setTradeRequests([]);
        setTradeRequests(tradeReqs);
      } catch (error) {
        console.log("Error cargando solicitudes:", error);
      }
    };

    gettingRequests();
  }, []);
  function handleAcceptRequest(r: {
    id: number;
    petitioner_name: string;
    petitioner: string;
    name: string;
    img: any;
  }) {
    const gettingRequests = async () => {
      const token = await secureStore.getItem("accessToken");
      const request = await axiosInstance.post(
        `/friends/accept_request`,
        {
          friend_id: r.petitioner,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.replace("/amigos");
    };

    gettingRequests();
  }

  function handleRejectRequest(r) {
    const gettingRequests = async () => {
      const token = await secureStore.getItem("accessToken");

      await axiosInstance.request({
        url: "/friends/deny_request",
        method: "DELETE",
        data: { friend_id: r.petitioner },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.back();
    };

    gettingRequests();
  }

  async function aceptarIntercambio(tradeId) {
    try {
      const token = await secureStore.getItem("accessToken");

      await axiosInstance.post(
        "/trade/confirm",
        { trade_id: tradeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.back();
    } catch (error) {
      console.log(error);
    }
  }

  async function rechazarIntercambio(tradeId) {
    try {
      const token = await secureStore.getItem("accessToken");

      await axiosInstance.post(
        "/trade/deny",
        { trade_id: tradeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Intercambio rechazado");
      router.replace("/amigos");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className="flex-1 bg-red-800 pt-20 px-5">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-white text-2xl font-bold">Notificaciones</Text>

        <GlobalButton
          onPress={() => router.back()}
          className="bg-black border border-red-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-red-600 font-semibold">Volver</Text>
        </GlobalButton>
      </View>

      <ScrollView>
        <Text className="text-white mb-4">
          Peticiones de Amistad Recibidas:
        </Text>
        {requests.length === 0 && (
          <View key="no-requests">
            <Text className="text-white/60 mb-4">
              No tienes solicitudes de amistad.
            </Text>
          </View>
        )}

        {requests.map((r) => (
          <View
            key={r.petitioner}
            className="bg-black border border-red-600 rounded-3xl px-4 py-4 mb-4 flex-row items-center"
          >
            {/* FOTO */}
            <Image
              source={
                r.img || {
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUSeONpWEdtwCAskidQnoPr7sAHmNWmbnnHw&s",
                }
              }
              className="w-16 h-16 rounded-full border-2 border-red-600 mr-4"
            />

            {/* INFO + BOTONES */}
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">
                {r.petitioner_name}
              </Text>

              <View className="flex-row gap-4 mt-3">
                <GlobalButton
                  onPress={() => {
                    handleAcceptRequest(r);
                  }}
                  className="bg-red-700 px-4 py-2 rounded-xl border-2 border-white"
                >
                  <Text className="text-white font-semibold">Aceptar</Text>
                </GlobalButton>

                <GlobalButton
                  onPress={() => {
                    handleRejectRequest(r);
                  }}
                  className="bg-white px-4 py-2 rounded-xl border-2 border-red-600"
                >
                  <Text className="text-black font-semibold">Rechazar</Text>
                </GlobalButton>
              </View>
            </View>
          </View>
        ))}
        {/*SECCIÓN DE INTERCAMBIOS*/}
        <Text className="text-white mt-8 mb-4">
          Solicitudes de Intercambio:
        </Text>

        {tradeRequests.length === 0 && (
          <View key="no-trades">
            <Text className="text-white/60 mb-4">
              No tienes solicitudes de intercambio.
            </Text>
          </View>
        )}

        {tradeRequests.map((t, index) => {
          return (
            <View
              key={t.trade_id}
              className="bg-black border border-red-600 rounded-2xl px-3 py-3 mb-3 self-center w-[90%]"
            >
              <Text className="text-white font-semibold text-base text-center leading-5 mb-2">
                {t.from_user} quiere intercambiar contigo
              </Text>

              <View className="items-center mb-3">
                <Text className="text-red-400 text-xs mb-1">
                  Pokémon ofrecido: {t.pokemon_offered} #
                  {t.pokemon_offered_number}
                </Text>

                <Text className="text-red-400 text-xs">
                  Pokemon que desea: {t.your_pokemon_name} #
                  {t.your_pokemon_number}
                </Text>
              </View>

              <View className="flex-row justify-center gap-3 mt-1">
                <GlobalButton
                  onPress={() => aceptarIntercambio(t.trade_id)}
                  className="bg-red-700 px-3 py-1.5 rounded-lg border border-white"
                >
                  <Text className="text-white text-sm font-semibold">
                    Aceptar
                  </Text>
                </GlobalButton>

                <GlobalButton
                  onPress={() => rechazarIntercambio(t.trade_id)}
                  className="bg-white px-3 py-1.5 rounded-lg border border-red-600"
                >
                  <Text className="text-black text-sm font-semibold">
                    Rechazar
                  </Text>
                </GlobalButton>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
