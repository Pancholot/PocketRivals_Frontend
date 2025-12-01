import { useEffect } from "react";
import { View, Text } from "react-native";
import GlobalButton from "@/components/GlobalButton";

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
    <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 w-80 rounded-xl bg-black/80 border-2 border-green-600 z-50">
      {/* Mensaje */}
      <Text className="text-white text-center text-base mb-3 font-medium">
        {message}
      </Text>

      {/* Botón OK centrado */}
      <GlobalButton
        onPress={onClose}
        className="bg-green-800 border-2 border-green-600 py-2 px-6 rounded-lg mx-auto"
      >
        <Text className="text-white font-bold text-lg">OK</Text>
      </GlobalButton>
    </View>
  );
}
