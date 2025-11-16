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
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.60)",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center px-4">
            <Image
              source={require("@/assets/icons/Logo.png")}
              style={{ width: 350, height: 175, marginBottom: 2 }}
              resizeMode="contain"
            />
            <Text className="color-white text-2xl font-bold  mb-2">Login</Text>
            <Text className="color-slate-400 mb-2">
              Bienvenido a nuestra App
            </Text>
            <TextInput
              className="border-2 border-white w-3/4 p-2 my-2 rounded text-white"
              value={email}
              onChange={(e) => handleOnChangeTextInput(e, setEmail)}
              placeholder="Email"
              placeholderTextColor={"white"}
            ></TextInput>
            <TextInput
              className="border-2 border-white w-3/4 p-2 my-2 rounded text-white"
              value={password}
              onChange={(e) => handleOnChangeTextInput(e, setPassword)}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={"white"}
            ></TextInput>
            <TouchableOpacity
              className="bg-white px-4 py-2 rounded mt-4"
              onPress={handleOnPressLogIn}
            >
              <Text>Log In</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default AuthScreen;
