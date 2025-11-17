import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { Audio } from "expo-av";
import { useMusic } from "@/components/MusicContext";

import CaptureBg from "@/assets/backgrounds/capture.jpg";
import CaptureButtonImage from "@/assets/icons/capture-button.png";
import { numeroAleatorio } from "functions/helpers";
import { pokemonSprite } from "functions/helpers";
import { Dimensions } from "react-native";

export default function Capturar() {
  const { stopMusic, playMusic, isPlaying } = useMusic();
  const [musicWasPlaying, setMusicWasPlaying] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);
  const [pokemonImage, setPokemonImage] = useState(null);
  const [showPokemon, setShowPokemon] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pokeballOpacity = useRef(new Animated.Value(1)).current;
  const pokemonScale = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const { height, width } = Dimensions.get("window");

  const playCaptureSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/captureSound.mp3")
    );
    await sound.playAsync();
    return sound;
  };

  const startShake = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ])
    );
  };

  const handleCapture = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // 1️⃣ Pausar música usando tu sistema actual
    setMusicWasPlaying(isPlaying);
    stopMusic();

    const id = numeroAleatorio();
    const pokeUri = pokemonSprite(id);
    setPokemonImage({ uri: pokeUri });

    const shaker = startShake();
    shaker.start();

    const captureSound = await playCaptureSound(); // 9s

    // Shake 5s
    await new Promise((res) => setTimeout(res, 5000));
    shaker.stop();

    // Pokeball fade out
    Animated.timing(pokeballOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      // Flash blanco
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Mostrar Pokémon
      setShowPokemon(true);
      Animated.spring(pokemonScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    });

    await new Promise((res) => setTimeout(res, 4000)); // resto del audio
    await captureSound.stopAsync();

    setIsAnimating(false);
  };

  const shakeStyle = {
    transform: [
      {
        translateX: shakeAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-12, 12],
        }),
      },
      {
        rotate: shakeAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: ["-10deg", "10deg"],
        }),
      },
    ],
    opacity: pokeballOpacity,
  };

  return (
    <ImageBackground
      source={CaptureBg}
      className="h-full flex flex-col items-center justify-center"
    >
      {/* FLASH */}
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: "white",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: flashOpacity,
          zIndex: 10,
        }}
      />

      {/* Pokeball */}
      {!showPokemon && (
        <TouchableOpacity
          className="w-72 h-72"
          onPress={handleCapture}
          disabled={isAnimating}
        >
          <Animated.Image
            source={CaptureButtonImage}
            className="w-full h-full"
            style={shakeStyle}
          />
        </TouchableOpacity>
      )}

      {/* Pokemon */}
      {showPokemon && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <Animated.View
            style={{
              transform: [{ scale: pokemonScale }],
              opacity: pokemonScale,
              alignItems: "center",
            }}
          >
            <Image
              source={pokemonImage}
              style={{
                width: width * 0.45, // 45% del ancho total
                height: width * 0.45, // siempre cuadrado
                resizeMode: "contain",
              }}
            />

            <TouchableOpacity
              className="mt-6 bg-white px-8 py-4 rounded-2xl"
              onPress={() => {
                if (musicWasPlaying) playMusic();
              }}
            >
              <Text className="text-black font-semibold text-lg">
                Agregar a mi colección
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ImageBackground>
  );
}
