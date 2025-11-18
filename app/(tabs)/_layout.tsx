import { Tabs } from "expo-router";
import { Image, View, Text, ActivityIndicator } from "react-native";
import { useScreenAssets } from "hooks/useScreenAssets";

export default function TabsLayout() {
  const loaded = useScreenAssets([
    require("@/assets/icons/settings.png"),
    require("@/assets/icons/pokemon.png"),
    require("@/assets/icons/pokeball.png"),
    require("@/assets/icons/amigos.png"),
    require("@/assets/icons/profilePic.png"),
    require("@/assets/icons/profilePic2.png"),
    require("@/assets/icons/profilePic3.png"),
    require("@/assets/icons/profilePic4.png"),
    require("@/assets/videos/pokemonRivals.mp4"),
  ]);

  if (!loaded) {
    return (
      <View className="flex-1 bg-red-800 items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4 text-lg">Cargando...</Text>
      </View>
    );
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },

        tabBarActiveTintColor: "#FF0000",
        tabBarInactiveTintColor: "#999999",
      }}
    >
      <Tabs.Screen
        name="amigos"
        options={{
          title: "Amigos",
          tabBarIcon: ({}) => (
            <Image
              source={require("@/assets/icons/amigos.png")}
              style={{
                width: 35,
                height: 35,
              }}
            />
          ),
          tabBarLabelStyle: {
            marginTop: 4,
            fontSize: 14,
            fontWeight: "bold",
          },
        }}
      />
      <Tabs.Screen
        name="capturar"
        options={{
          title: "Capturar",
          tabBarIcon: ({}) => (
            <Image
              source={require("@/assets/icons/pokeball.png")}
              style={{
                width: 35,
                height: 35,
              }}
            />
          ),
          tabBarLabelStyle: {
            marginTop: 4,
            fontSize: 14,
            fontWeight: "bold",
          },
        }}
      />
      <Tabs.Screen
        name="pokemon"
        options={{
          title: "Pokemon",
          tabBarIcon: ({}) => (
            <Image
              source={require("@/assets/icons/pokemon.png")}
              style={{
                width: 35,
                height: 35,
              }}
            />
          ),
          tabBarLabelStyle: {
            marginTop: 4,
            fontSize: 14,
            fontWeight: "bold",
          },
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: "Ajustes",
          tabBarIcon: ({}) => (
            <Image
              source={require("@/assets/icons/settings.png")}
              style={{
                width: 35,
                height: 35,
              }}
            />
          ),
          tabBarLabelStyle: {
            marginTop: 4,
            fontSize: 14,
            fontWeight: "bold",
          },
        }}
      />
    </Tabs>
  );
}
