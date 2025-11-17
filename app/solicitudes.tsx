import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFriendRequests } from "hooks/useFriendRequests";
import { useFriends } from "hooks/useFriends";

export default function Solicitudes() {
  const router = useRouter();
  const { requests, removeRequest } = useFriendRequests();
  const { addFriend } = useFriends();
  return (
    <View className="flex-1 bg-red-800 pt-20 px-5">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-white text-2xl font-bold">Solicitudes</Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black border border-red-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-red-600 font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Text className="text-white mb-4">
          Peticiones de Amistad Recibidas:
        </Text>

        {requests.map((r) => (
          <View
            key={r.id}
            className="bg-black border border-red-600 rounded-3xl px-4 py-4 mb-4 flex-row items-center"
          >
            {/* FOTO */}
            <Image
              source={r.img}
              className="w-16 h-16 rounded-full border-2 border-red-600 mr-4"
            />

            {/* INFO + BOTONES */}
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">
                {r.name} ({r.realId})
              </Text>

              <View className="flex-row gap-4 mt-3">
                <TouchableOpacity
                  onPress={() => {
                    addFriend({
                      id: Date.now(),
                      name: r.name,
                      realId: r.realId,
                      lastCatch: "N/A",
                      img: r.img,
                    });
                    removeRequest(r.id);
                  }}
                  className="bg-red-700 px-4 py-2 rounded-xl border-2 border-white"
                >
                  <Text className="text-white font-semibold">Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeRequest(r.id)}
                  className="bg-white px-4 py-2 rounded-xl border-2 border-red-600"
                >
                  <Text className="text-black font-semibold">Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
