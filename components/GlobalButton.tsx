import React, { useRef } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Audio } from "expo-av";

export default function GlobalButton({
  children,
  onPress,
  ...props
}: TouchableOpacityProps) {
  const sound = useRef<Audio.Sound | null>(null);

  const playClickSound = async () => {
    try {
      if (sound.current) {
        await sound.current.replayAsync();
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/buttonClick.mp3")
      );
      sound.current = newSound;
      await newSound.playAsync();
    } catch (e) {
      console.log("Error reproduciendo sonido:", e);
    }
  };

  const handlePress = async (e: any) => {
    await playClickSound();
    if (onPress) onPress(e);
  };

  return (
    <TouchableOpacity onPress={handlePress} {...props}>
      {children}
    </TouchableOpacity>
  );
}
