import { View } from "react-native";
import "../global.css";
import AuthScreen from "screens/AuthScreen";
import HomeScreen from "screens/HomeScreen";
import { Stack } from "expo-router";
import { MusicProvider } from "@/components/MusicContext";

const App = () => {
  //return <HomeScreen />;
  return (
    <MusicProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#000",
          headerTitleAlign: "left",
          headerTitleStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Log in" }}></Stack.Screen>
        <Stack.Screen name="(tabs)" options={{ title: "Home" }}></Stack.Screen>
      </Stack>
    </MusicProvider>
  );
};

export default App;
