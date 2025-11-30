import { useEffect } from "react";
import { View, Text } from "react-native";
import GlobalButton from "./GlobalButton"; // ajusta la ruta si es necesario

export default function TradeAcceptedNotification({
  message,
  onClose,
  duration = 4000, // 4 segundos por defecto
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <View className="absolute top-24 left-5 right-5 p-4 rounded-2xl bg-black/80 border border-green-500 z-50">
      <Text className="text-white text-center mb-3 text-base">{message}</Text>

      <GlobalButton
        onPress={onClose}
        className="bg-green-600 px-4 py-2 rounded-xl"
      >
        <Text className="text-white font-bold">OK</Text>
      </GlobalButton>
    </View>
  );
}
