import {
  View,
  Text,
  TextInput,
  TextInputChangeEvent,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { logIn } from "api/apiService";
import { useRouter } from "expo-router";
import { useMusic } from "@/components/MusicContext";

const AuthScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { playMusic } = useMusic();
  const router = useRouter();

  const handleOnChangeTextInput = (
    e: TextInputChangeEvent,
    func: Dispatch<SetStateAction<string>>
  ) => {
    func(e.nativeEvent.text);
  };

  const handleOnPressLogIn = async () => {
    Keyboard.dismiss();
    await playMusic();
    /*try {
      console.log("Logging in with", { email, password });
      const message = await logIn({ email, password });
      if (message == "Bienvenido") {
        Alert.alert("Bienvenido");*/
    router.replace("/capturar");
    /*}
      setEmail("");
      setPassword("");
    } catch (e) {
      Alert.alert("Error al iniciar sesión", e.message);
      console.error("Login failed:", e);
    }*/
  };
  return (
    <ImageBackground
      source={require("@/assets/backgrounds/auth.png")}
      resizeMode="cover"
      className="h-full flex items-center justify-center"
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.60)",
        }}
      />

      <View className="flex items-center justify-center h-fit p-6 w-3/4 border-2 rounded-xl bg-red-800/60">
        <Image
          source={require("@/assets/icons/Logo.png")}
          style={{ width: 350, height: 175, marginBottom: 2 }}
          resizeMode="contain"
        />
        <Text className="color-white text-xl font-bold text-center mb-2">
          ¡Bienvenido a Pocket Rivals!
        </Text>
        <TextInput
          className="border-2 border-white p-2 my-2 rounded text-white w-full rounded-full"
          value={email}
          onChange={(e) => handleOnChangeTextInput(e, setEmail)}
          placeholder="Email"
          placeholderTextColor={"white"}
        ></TextInput>
        <TextInput
          className="border-2 border-white  p-2 my-2 w-full text-white rounded-full"
          value={password}
          onChange={(e) => handleOnChangeTextInput(e, setPassword)}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor={"white"}
        ></TextInput>
        <TouchableOpacity
          className="bg-yellow-300 w-full px-4 py-2 mt-4 rounded-full"
          onPress={handleOnPressLogIn}
        >
          <Text className="text-center text-xl tracking-widest font-extrabold">
            Iniciar sesión
          </Text>
        </TouchableOpacity>
        <View className="mt-4 flex items-center justify-center w-full">
          <Text className=" text-slate-300">Aún no tienes cuenta? </Text>
          <TouchableOpacity
            className="bg-slate-300 w-full px-4 py-2 mt-4 rounded-full"
            onPress={handleOnPressLogIn}
          >
            <Text className="text-center text-xl tracking-widest font-extrabold">
              Registrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default AuthScreen;
