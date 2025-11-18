import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import AuthScreen from "screens/AuthScreen";
import { Stack } from "expo-router";
import { MusicProvider } from "contexts/MusicContext";
import { FriendRequestProvider } from "hooks/useFriendRequests";
import { FriendsProvider } from "hooks/useFriends";
import { PokemonProvider } from "contexts/PokemonContext";
import { PreloadProvider } from "contexts/PreloadContext";

const App = () => {
  //return <HomeScreen />;
  return (
    <SafeAreaProvider>
      <MusicProvider>
        <FriendRequestProvider>
          <FriendsProvider>
            <PokemonProvider>
              <PreloadProvider>
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
                  <Stack.Screen
                    name="index"
                    options={{ title: "Log in" }}
                  ></Stack.Screen>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ title: "Home" }}
                  ></Stack.Screen>
                </Stack>
              </PreloadProvider>
            </PokemonProvider>
          </FriendsProvider>
        </FriendRequestProvider>
      </MusicProvider>
    </SafeAreaProvider>
  );
};

export default App;
