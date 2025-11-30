import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import AuthScreen from "screens/AuthScreen";
import { Stack } from "expo-router";
import { MusicProvider } from "contexts/MusicContext";
import { FriendRequestProvider } from "contexts/useFriendRequests";
import { FriendsProvider } from "contexts/useFriends";
import { PokemonProvider } from "contexts/PokemonContext";
import { PreloadProvider } from "contexts/PreloadContext";
import { UserProvider } from "contexts/UserContext";
import { TradeRequestsProvider } from "contexts/useTradeRequests";
import {
  TradeNotifProvider,
  useTradeNotif,
} from "contexts/useTradeNotifications";
import { useWebSocket, WebSocketProvider } from "contexts/WebSocketContext";
import { useEffect } from "react";
import { View, Text } from "react-native";
import GlobalButton from "@/components/GlobalButton";
import TradeAcceptedNotification from "@/components/TradeAcceptedNotification";

const Root = () => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <WebSocketProvider>
          <MusicProvider>
            <FriendRequestProvider>
              <FriendsProvider>
                <TradeRequestsProvider>
                  <TradeNotifProvider>
                    <PokemonProvider>
                      <PreloadProvider>
                        <App />
                      </PreloadProvider>
                    </PokemonProvider>
                  </TradeNotifProvider>
                </TradeRequestsProvider>
              </FriendsProvider>
            </FriendRequestProvider>
          </MusicProvider>
        </WebSocketProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

const App = () => {
  const { tradeAcceptedMessage, setTradeAcceptedMessage } = useTradeNotif();
  const socket = useWebSocket();
  useEffect(() => {
    if (!socket) return;

    // ESCUCHAR CUANDO OTRO USUARIO ACEPTA TU TRADE
    socket.on("trade_accepted", (data) => {
      console.log("TRADE ACCEPTED WS:", data);

      setTradeAcceptedMessage(
        `Tu intercambio con ${data.other_username} fue aceptado`
      );
    });

    return () => {
      socket.off("trade_accepted");
    };
  }, [socket]);
  return (
    <>
      {/* NOTIFICACIÓN DE TRADE ACEPTADO */}
      <TradeAcceptedNotification
        message={tradeAcceptedMessage}
        onClose={() => setTradeAcceptedMessage(null)}
      />
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
    </>
  );
};

export default Root;
