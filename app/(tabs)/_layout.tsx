import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabsLayout() {
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
