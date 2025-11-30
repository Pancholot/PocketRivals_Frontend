import { View, Text, ImageBackground, Image, Animated } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Audio, Video, ResizeMode } from "expo-av";
import { useMusic } from "contexts/MusicContext";
import { Dimensions, Easing } from "react-native";
import axiosInstance from "api/axiosInstance";

import pokemonRivals from "@/assets/videos/pokemonRivals.mp4";
import CaptureButtonImage from "@/assets/icons/capture-button.png";
import { numeroAleatorio, pokemonSprite, PokemonName } from "functions/helpers";
import { usePokemon } from "contexts/PokemonContext";
import GlobalButton from "@/components/GlobalButton";
import { secureStore } from "functions/secureStore";
import { jwtDecode } from "jwt-decode";
import { decodeJwtForData } from "functions/UI.utils";
import { useUser } from "contexts/UserContext";

export default function Capturar() {
  const { stopMusic, playMusic, isPlaying } = useMusic();

  const [musicWasPlaying, setMusicWasPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPokemon, setShowPokemon] = useState(false);
  const [username, setUsername] = useState("");

  const [pokemonNameCaptured, setPokemonName] = useState("");
  const [pokemonImage, setPokemonImage] = useState(null);
  const [capturedId, setCapturedId] = useState<number | null>(null);
  const { user } = useUser();

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

  const [isCooldown, setIsCooldown] = useState(false);
  const COOLDOWN_TIME = 3000;
  const cooldownOpacity = useRef(new Animated.Value(1)).current;
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);

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

  const startCooldownAnimation = () => {
    cooldownOpacity.setValue(0.3);
    Animated.timing(cooldownOpacity, {
      toValue: 0.6,
      duration: COOLDOWN_TIME,
      useNativeDriver: true,
    }).start(() => cooldownOpacity.setValue(1));
  };

  const pokeballCooldownStyle = {
    opacity: cooldownOpacity,
  };

  const combinedOpacity = Animated.multiply(pokeballOpacity, cooldownOpacity);

  useEffect(() => {
    if (!isAnimating && !showPokemon && !isCooldown) startReadyAnimation();
  }, [isAnimating, showPokemon, isCooldown]);

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
    if (isAnimating || isCooldown) return;

    setIsAnimating(true);

    // Guarda música
    setMusicWasPlaying(isPlaying);
    stopMusic();

    try {
      const token = await secureStore.getItem("accessToken");

      const { data } = await axiosInstance.get("/capture_pokemon", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const id = data.pokedex_number;

      setCapturedId(id);
      setPokemonName(PokemonName(data.name));
      setPokemonImage({ uri: pokemonSprite(id) });

      // 🔥 Animación de shake (no bloqueante)
      const shaker = startShake();
      shaker.start();

      playCaptureSound();

      // 🔥 Después de 5 segundos mostramos el flash + pokemon (sin bloquear)
      setTimeout(() => {
        shaker.stop();
        shakeAnim.setValue(0);

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
      }, 5000);

      // 🔥 Después de 14 segundos, terminamos animación global
      setTimeout(() => {
        setIsAnimating(false);

        // limpiar audio
        if (soundObject.current) {
          soundObject.current.stopAsync().catch(() => {});
          soundObject.current.unloadAsync().catch(() => {});
          soundObject.current = null;
        }
      }, 9000);
    } catch (err) {
      console.log("Error al capturar:", err);
      setIsAnimating(false);
    }
  };

  // REINICIO
  const resetCapture = () => {
    setShowPokemon(false);
    pokeballOpacity.setValue(1);
    pokemonScale.setValue(0);

    // ⏳ Iniciar cooldown + contador
    setIsCooldown(true);
    setCooldownTimeLeft(COOLDOWN_TIME / 1000); // segundos

    startCooldownAnimation();

    const interval = setInterval(() => {
      setCooldownTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

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
  };

  return (
    <View className="h-full w-full">
      <Text className="text-white absolute font-extrabold tracking-widest z-50 top-28 left-5 text-xl bg-gray-400/30 rounded-xl p-2">
        Hola, {user?.username}!
      </Text>
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
          {/* CONTENEDOR RELATIVE */}
          <View className="relative w-60 h-60">
            {/* ⏳ Contador arriba de la pokeball */}
            {isCooldown && (
              <Text
                className="
                  absolute 
                  -top-10
                  left-1/2 
                  -translate-x-1/2
                  text-5xl 
                  font-extrabold 
                  text-amber-400 
                  shadow-black 
                  shadow-lg 
                  tracking-wide
                "
              >
                {cooldownTimeLeft}
              </Text>
            )}

            {/* Pokebola (posición fija) */}
            <GlobalButton
              className="absolute inset-0"
              onPress={handleCapture}
              disabled={isAnimating || isCooldown}
            >
              <Animated.Image
                source={CaptureButtonImage}
                resizeMode="contain"
                className="w-full h-full"
                style={[
                  shakeStyle,
                  !isAnimating && !isCooldown ? pokeballReadyStyle : {},
                ]}
              />
            </GlobalButton>
          </View>
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
            className="w-[90%] bg-red-700 border-[3px] border-yellow-400 px-6 py-4 rounded-3xl shadow-xl mt-4"
            onPress={async () => {
              // detener audio
              if (soundObject.current) {
                try {
                  await soundObject.current.stopAsync();
                  await soundObject.current.unloadAsync();
                } catch (e) {
                  console.log("Error al detener sonido:", e);
                }
                soundObject.current = null;
              }

              resetCapture();
            }}
          >
            <Text className="text-white font-extrabold text-xl text-center">
              ¡Felicidades,{"\n"}atrapaste a {pokemonNameCaptured}!
            </Text>

            <View className="mb-2" />

            <Text className="text-yellow-200 font-semibold text-center text-base">
              Capturar otro Pokémon
            </Text>
          </GlobalButton>
        </View>
      )}
    </View>
  );
}
