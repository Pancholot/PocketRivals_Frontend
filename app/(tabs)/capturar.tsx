import { View, Text, ImageBackground, Image, Animated } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Audio, Video, ResizeMode } from "expo-av";
import { useMusic } from "contexts/MusicContext";
import { Dimensions, Easing } from "react-native";

import pokemonRivals from "@/assets/videos/pokemonRivals.mp4";
import CaptureButtonImage from "@/assets/icons/capture-button.png";
import { numeroAleatorio, pokemonSprite, PokemonName } from "functions/helpers";
import { usePokemon } from "contexts/PokemonContext";
import GlobalButton from "@/components/GlobalButton";

export default function Capturar() {
  const { stopMusic, playMusic, isPlaying } = useMusic();

  const [musicWasPlaying, setMusicWasPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPokemon, setShowPokemon] = useState(false);

  const [pokemonNameCaptured, setPokemonName] = useState("");
  const [pokemonImage, setPokemonImage] = useState(null);
  const [capturedId, setCapturedId] = useState<number | null>(null);

  // Animaciones
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pokeballOpacity = useRef(new Animated.Value(1)).current;
  const pokeballReadyAnim = useRef(new Animated.Value(0)).current;

  const pokemonScale = useRef(new Animated.Value(0)).current;
  const pokemonBounce = useRef(new Animated.Value(0)).current;

  const flashOpacity = useRef(new Animated.Value(0)).current;

  const soundObject = useRef(null);
  const { width } = Dimensions.get("window");
  const { addPokemon } = usePokemon();

  // AUDIO MODE
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    return () => {
      if (soundObject.current) soundObject.current.unloadAsync();
    };
  }, []);

  // SONIDO DE CAPTURA
  const playCaptureSound = async () => {
    try {
      if (soundObject.current) {
        await soundObject.current.stopAsync();
        await soundObject.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/captureSound.mp3")
      );

      soundObject.current = sound;
      await sound.playAsync();
    } catch (err) {
      console.log("Error sonido:", err);
    }
  };

  // ANIMACIÓN DE “POKEBALL LISTA"
  const startReadyAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pokeballReadyAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pokeballReadyAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (!isAnimating && !showPokemon) startReadyAnimation();
  }, [isAnimating, showPokemon]);

  const pokeballReadyStyle = {
    transform: [
      {
        rotate: pokeballReadyAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["-5deg", "5deg"],
        }),
      },
    ],
  };

  // ANIMACIÓN DE SHAKE (capturando)
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

  // ANIMACIÓN DE BOUNCE DEL POKÉMON
  const startPokemonBounce = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pokemonBounce, {
          toValue: -18,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pokemonBounce, {
          toValue: 0,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // CAPTURAR
  const handleCapture = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setMusicWasPlaying(isPlaying);
    stopMusic();

    const id = numeroAleatorio();
    setCapturedId(id);
    const resName = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const dataName = await resName.json();
    setPokemonName(PokemonName(dataName.species.name));
    setPokemonImage({ uri: pokemonSprite(id) });

    const shake = startShake();
    shake.start();

    playCaptureSound();

    await new Promise((res) => setTimeout(res, 5000));

    shake.stop();
    shakeAnim.setValue(0);

    // Ocultar pokeball + flash + mostrar Pokémon
    Animated.timing(pokeballOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
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
      startPokemonBounce();

      Animated.spring(pokemonScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    });

    await new Promise((res) => setTimeout(res, 9000));

    if (soundObject.current) {
      try {
        await soundObject.current.stopAsync();
        await soundObject.current.unloadAsync();
      } catch {}
      soundObject.current = null;
    }

    setIsAnimating(false);
  };

  // REINICIO
  const resetCapture = () => {
    setShowPokemon(false);
    pokeballOpacity.setValue(1);
    pokemonScale.setValue(0);
    if (musicWasPlaying) playMusic();
  };

  // SHAKE DE LA POKEBALL DURANTE LA CAPTURA
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
    <View className="h-full w-full">
      <Video
        source={require("@/assets/videos/pokemonRivals.mp4")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
      />
      {/* FLASH */}
      {isAnimating && (
        <Animated.View
          pointerEvents="none"
          style={{ opacity: flashOpacity }}
          className="absolute inset-0 bg-white z-50"
        />
      )}

      {/* POKEBALL */}
      {!showPokemon && (
        <View className="absolute inset-0 justify-center items-center z-20">
          <GlobalButton
            className="w-60 h-60"
            onPress={handleCapture}
            disabled={isAnimating}
          >
            <Animated.Image
              source={CaptureButtonImage}
              resizeMode="contain"
              className="w-full h-full"
              style={[shakeStyle, !isAnimating ? pokeballReadyStyle : {}]}
            />
          </GlobalButton>
        </View>
      )}

      {/* POKEMON */}
      {showPokemon && (
        <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center pb-24">
          <Animated.Image
            source={pokemonImage}
            style={{
              width: width * 0.6,
              height: width * 0.6,
              resizeMode: "contain",
              transform: [
                { scale: pokemonScale },
                { translateY: pokemonBounce },
              ],
            }}
          />

          <GlobalButton
            className="bg-red-800 border-2 px-8 py-4 rounded-2xl"
            onPress={async () => {
              if (!capturedId) return;

              // detener audio
              if (soundObject.current) {
                try {
                  await soundObject.current.stopAsync();
                  await soundObject.current.unloadAsync();
                } catch {}
              }

              // API POKÉMON
              const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${capturedId}`
              );
              const data = await res.json();

              addPokemon({
                id: Math.random().toString(36).substring(2, 12),
                name: data.species.name,
                pokedex_number: capturedId,
                type1: data.types[0].type.name,
                type2: data.types[1]?.type.name || null,
                mote: null,
                in_team: 0,
                obtained_at: new Date().toUTCString(),
                player_id: "yourPlayerId",
              });

              resetCapture();
            }}
          >
            <Text className="text-white font-bold text-xl text-center">
              ¡Has atrapado a {pokemonNameCaptured}!{"\n"}
              <Text className="text-sm text-white">
                Agregalo a tu colección
              </Text>
            </Text>
          </GlobalButton>
        </View>
      )}
    </View>
  );
}
