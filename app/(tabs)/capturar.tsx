import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  Alert, // Importamos Alert para debugging
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Audio } from "expo-av";
import { useMusic } from "@/components/MusicContext";
import { Dimensions } from "react-native";

import CaptureBg from "@/assets/backgrounds/capture.jpg";
import CaptureButtonImage from "@/assets/icons/capture-button.png";
import { numeroAleatorio } from "functions/helpers";
import { pokemonSprite } from "functions/helpers";

export default function Capturar() {
  const { stopMusic, playMusic, isPlaying } = useMusic();
  const [musicWasPlaying, setMusicWasPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pokemonImage, setPokemonImage] = useState(null);
  const [showPokemon, setShowPokemon] = useState(false);

  const soundObject = useRef(null);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pokeballOpacity = useRef(new Animated.Value(1)).current;
  const pokemonScale = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get("window");

  // --- Setup de Audio igual que antes ---
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          playThroughEarpieceAndroid: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.warn("Audio error", error);
      }
    };
    initAudio();
    return () => {
      if (soundObject.current) soundObject.current.unloadAsync();
    };
  }, []);

  const playCaptureSound = async () => {
    try {
      if (soundObject.current) await soundObject.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/captureSound.mp3")
      );
      soundObject.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log("Error sonido", error);
    }
  };

  const startShake = () => {
    const animation = Animated.loop(
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
    return animation;
  };

  const handleCapture = async () => {
    console.log("BOTÓN PRESIONADO"); // Debug log
    if (isAnimating) return;

    setIsAnimating(true);
    setMusicWasPlaying(isPlaying);
    stopMusic();

    const id = numeroAleatorio();
    // Fix HTTPS
    let pokeUri = pokemonSprite(id);
    if (pokeUri && pokeUri.startsWith("http://")) {
      pokeUri = pokeUri.replace("http://", "https://");
    }
    setPokemonImage({ uri: pokeUri });

    const shaker = startShake();
    shaker.start();

    const captureSound = await playCaptureSound(); // 9s

    // Shake 5s
    await new Promise((res) => setTimeout(res, 5000));
    shaker.stop();
    shakeAnim.setValue(0);

    Animated.timing(pokeballOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      // Animamos el flash
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

      setShowPokemon(true);
      Animated.spring(pokemonScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    });

    await new Promise((res) => setTimeout(res, 2000));
    if (soundObject.current) {
      try {
        await soundObject.current.stopAsync();
        await soundObject.current.unloadAsync();
      } catch (e) {}
      soundObject.current = null;
    }
    setIsAnimating(false);
  };

  const resetCapture = () => {
    setShowPokemon(false);
    pokeballOpacity.setValue(1);
    pokemonScale.setValue(0);
    if (musicWasPlaying) playMusic();
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
      {/* SOLUCIÓN: 
          El Flash SOLO se renderiza si isAnimating es true.
          Antes estaba siempre renderizado tapando el botón.
      */}
      {isAnimating && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            backgroundColor: "white",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: flashOpacity,
            zIndex: 50, // Muy alto para tapar todo CUANDO APAREZCA
            elevation: 50, // Fix Android elevation
          }}
        />
      )}

      {!showPokemon && (
        <TouchableOpacity
          className="w-72 h-72"
          onPress={handleCapture}
          disabled={isAnimating}
          activeOpacity={0.8}
          // Aseguramos que el botón tenga zIndex para estar sobre el fondo
          style={{ zIndex: 20, elevation: 20 }}
        >
          <Animated.Image
            source={CaptureButtonImage}
            className="w-full h-full"
            style={shakeStyle}
            resizeMode="contain" // Asegura que la imagen esté dentro del touchable
          />
        </TouchableOpacity>
      )}

      {showPokemon && (
        <View
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          style={{ zIndex: 30, elevation: 30 }} // Capa superior al final
        >
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
                width: width * 0.6,
                height: width * 0.6,
                resizeMode: "contain",
              }}
            />

            <TouchableOpacity
              className="mt-8 bg-white px-8 py-4 rounded-2xl shadow-lg"
              onPress={resetCapture}
              style={{ elevation: 5 }}
            >
              <Text className="text-black font-bold text-xl text-center">
                ¡Atrapado!{"\n"}
                <Text className="text-sm font-normal text-gray-500">
                  Agregar a mi colección
                </Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ImageBackground>
  );
}
