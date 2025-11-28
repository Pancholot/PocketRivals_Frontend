import { View, Text, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFriendRequests } from "contexts/useFriendRequests";
import GlobalButton from "@/components/GlobalButton";
import { useEffect } from "react";
import { secureStore } from "functions/secureStore";
import axiosInstance from "api/axiosInstance";

export default function Solicitudes() {
  const router = useRouter();
  const { requests, setRequests } = useFriendRequests();

  useEffect(() => {
    try {
      const gettingRequests = async () => {
        const token = await secureStore.getItem("accessToken");
        const { data } = await axiosInstance.get(`/friends/check_requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRequests(data);
      };

      gettingRequests();
    } catch (error) {
      console.log(error.message);
    }
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

  function handleRejectRequest(r: {
    id: number;
    petitioner_name: string;
    petitioner: string;
    name: string;
    img: any;
  }) {
    const gettingRequests = async () => {
      const token = await secureStore.getItem("accessToken");
      const request = await axiosInstance.post(
        `/friends/reject_request`,
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

  return (
    <View className="flex-1 bg-red-800 pt-20 px-5">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-white text-2xl font-bold">Solicitudes</Text>

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
      </ScrollView>
    </View>
  );
}
