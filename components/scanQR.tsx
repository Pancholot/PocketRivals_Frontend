import { useState, useRef } from "react";
import { View, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import GlobalButton from "./GlobalButton";
import { G } from "react-native-svg";

export default function ScanQR({ onScanned, onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const isBlockedRef = useRef(false);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white">
          Pidiendo permiso para usar la cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="bg-white w-full max-w-xs rounded-2xl p-6 items-center">
          <Text className="text-black text-xl font-bold mb-4 text-center">
            Permiso de Cámara Requerido
          </Text>

          <Text className="text-gray-700 mb-6 text-center">
            Para escanear un código QR, necesitamos acceso a tu cámara.
          </Text>

          <GlobalButton
            onPress={requestPermission}
            className="bg-blue-600 w-full py-3 rounded-xl mb-3"
          >
            <Text className="text-center text-white font-bold text-lg">
              Conceder Permiso
            </Text>
          </GlobalButton>

          <GlobalButton
            onPress={onClose}
            className="bg-gray-300 w-full py-3 rounded-xl"
          >
            <Text className="text-center text-black font-semibold text-lg">
              Cerrar
            </Text>
          </GlobalButton>
        </View>
      </View>
    );
  }

  const handleScan = ({ data }) => {
    if (isBlockedRef.current) return;

    isBlockedRef.current = true;
    setScanned(true);

    onScanned(data);

    setTimeout(() => {
      onClose();
      isBlockedRef.current = false;
    }, 200);
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={handleScan}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
    </View>
  );
}
