import { createContext, useContext, useState } from "react";
import { Audio } from "expo-av";

interface MusicContextType {
  isPlaying: boolean;
  playMusic: () => Promise<void>;
  stopMusic: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  playMusic: async () => {},
  stopMusic: async () => {},
});

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playMusic = async () => {
    if (isPlaying) return;

    const { sound: s } = await Audio.Sound.createAsync(
      require("@/assets/sounds/LittlerootTown.mp3")
    );

    setSound(s);
    setIsPlaying(true);
    await s.playAsync();
  };

  const stopMusic = async () => {
    if (!isPlaying || !sound) return;
    await sound.stopAsync();
    await sound.unloadAsync();
    setSound(null);
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, playMusic, stopMusic }}>
      {children}
    </MusicContext.Provider>
  );
};
