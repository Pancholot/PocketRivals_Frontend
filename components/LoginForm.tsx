import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TextInputChangeEvent,
  Keyboard,
  Alert,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useMusic } from "contexts/MusicContext";
import { useRouter } from "expo-router";
import GlobalButton from "./GlobalButton";
import { usePreload } from "contexts/PreloadContext";
import { logIn } from "api/apiService";
import PasswordInput from "./PasswordInput";
import { useUser } from "contexts/UserContext";
import { decodeJwtForData } from "functions/UI.utils";
import { jwtDecode } from "jwt-decode";

export default function LoginForm({ setFormType }) {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = useUser();
  const { playMusic } = useMusic();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const { ready } = usePreload();

  const handleOnChangeTextInput = (
    e: TextInputChangeEvent,
    func: Dispatch<SetStateAction<string>>
  ) => {
    func(e.nativeEvent.text);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setEmailError("Ingresa un correo válido.");
    } else {
      setEmailError("");
    }
  };

  const handleOnPressLogIn = async () => {
    if (isLoggingIn) return;

    if (!email.trim() || !password.trim()) {
      return Alert.alert(
        "Campos incompletos",
        "Ingresa tu email y contraseña."
      );
    }

    setIsLoggingIn(true);
    Keyboard.dismiss();
    await playMusic();

    try {
      console.log("Logging in with", { email, password });
      const message = await logIn({ email, password });

      if (message.ok) {
        setUser(jwtDecode(message.access_token));
        router.replace("/capturar");
      } else {
        Alert.alert("Inicio de sesión fallido");
      }

      setEmail("");
      setPassword("");
    } catch (e) {
      const backendMessage =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "No se pudo conectar al servidor.";

      Alert.alert("Error al iniciar sesión", backendMessage);
      console.error("Login failed:", e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View className="flex items-center justify-center h-fit p-6 w-3/4 border-2 rounded-xl bg-red-800/60">
      <Image
        source={require("@/assets/icons/Logo.png")}
        style={{ width: 350, height: 175, marginBottom: 2 }}
        resizeMode="contain"
      />
      <Text className="color-white text-xl font-bold text-center mb-2">
        ¡Bienvenido de nuevo, Entrenador!
      </Text>
      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text);
        }}
        placeholder="Email"
        placeholderTextColor="white"
        style={{
          borderWidth: 2,
          borderColor: emailError ? "red" : "white",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 999,
          color: "white",
          width: "100%",
          marginVertical: 8,
          fontSize: 16,
        }}
      />
      {emailError !== "" && (
        <Text style={{ color: "red", alignSelf: "center", marginTop: -5 }}>
          {emailError}
        </Text>
      )}
      <PasswordInput password={password} setPassword={setPassword} />
      <GlobalButton
        disabled={!ready || isLoggingIn}
        className={`w-full px-4 py-2 mt-4 rounded-full ${
          !ready
            ? "bg-gray-400"
            : isLoggingIn
              ? "bg-yellow-200 opacity-50"
              : "bg-yellow-300"
        }`}
        onPress={handleOnPressLogIn}
      >
        <Text className="text-center text-xl font-extrabold">
          {!ready
            ? "Cargando recursos..."
            : isLoggingIn
              ? "Iniciando..."
              : "Iniciar sesión"}
        </Text>
      </GlobalButton>
      <View className="mt-4 flex items-center justify-center w-full">
        <Text className=" text-slate-300">¿Aún no tienes cuenta? </Text>

        <GlobalButton
          className="bg-slate-300 w-full px-4 py-2 mt-4 rounded-full"
          onPress={() => setFormType("register")}
        >
          <Text className="text-center text-xl tracking-widest font-extrabold">
            Registrarse
          </Text>
        </GlobalButton>
      </View>
    </View>
  );
}
