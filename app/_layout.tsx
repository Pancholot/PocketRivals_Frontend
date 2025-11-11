import { View } from "react-native";
import "../global.css";
import AuthScreen from "screens/AuthScreen";
import HomeScreen from "screens/HomeScreen";
import { Stack } from "expo-router";

const App = () => {
  //return <HomeScreen />;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Log in" }}></Stack.Screen>
      <Stack.Screen name="(tabs)" options={{ title: "Home" }}></Stack.Screen>
    </Stack>
  );
};

export default App;
