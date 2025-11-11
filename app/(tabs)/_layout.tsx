import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 100,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        // 1. Amigos
        name="amigos" // Se enlaza al archivo app/(tabs)/amigos.tsx
        options={{
          title: "Amigos", // Este es el texto que se mostrará
        }}
      />
      <Tabs.Screen
        // 2. Capturar
        name="capturar" // Se enlaza al archivo app/(tabs)/capturar.tsx
        options={{
          title: "Capturar",
        }}
      />
      <Tabs.Screen
        // 3. Pokemon
        name="pokemon" // Se enlaza al archivo app/(tabs)/pokemon.tsx
        options={{
          title: "Pokemon",
        }}
      />
      <Tabs.Screen
        // 4. Ajustes
        name="ajustes" // Se enlaza al archivo app/(tabs)/ajustes.tsx
        options={{
          title: "Ajustes",
        }}
      />
    </Tabs>
  );
}
