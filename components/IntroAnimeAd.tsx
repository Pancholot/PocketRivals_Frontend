import { View } from "react-native";
// 1. Importa Video y ResizeMode desde el paquete 'expo-av'
import { Video, ResizeMode } from "expo-av";
import { useState } from "react";

export default function IntroAnimeAd() {
  // Opcional: para controlar el estado de reproducción
  const [status, setStatus] = useState({});

  return (
    <View className="p-4 h-24 w-24">
      <Video
        // 2. Fuente del video (local o de internet)
        source={require("@/assets/videos/videoplayback.mp4")}
        // source={{ uri: 'https://.../video.mp4' }} // Si es de internet

        // 3. ¡Usa NativeWind para el tamaño!
        className="w-full h-64 rounded-lg"
        // 4. Muestra los controles nativos (play, pausa, slider)
        useNativeControls={true}
        // 5. Cómo se ajusta el video (igual que en Image)
        // .CONTAIN = se ve todo, .COVER = rellena el espacio
        resizeMode={ResizeMode.CONTAIN}
        // 6. Opcional: para que se repita en bucle
        isLooping={true}
        // 7. Opcional: para saber si se está reproduciendo
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
}
