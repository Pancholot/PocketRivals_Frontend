import {
  View,
  Text,
  Image,
  TextInput,
  TextInputChangeEvent,
  Keyboard,
  GestureResponderEvent,
  Alert,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useMusic } from "contexts/MusicContext";
import { useRouter } from "expo-router";
import GlobalButton from "./GlobalButton";
import { usePreload } from "contexts/PreloadContext";
import { register } from "api/apiService";
import PasswordInput from "./PasswordInput";

const RegisterForm = ({ setFormType }) => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { playMusic } = useMusic();
  const [isRegistering, setIsRegistering] = useState(false);
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

  const handleOnPressRegister = async () => {
    if (isRegistering) return;

    if (!email.trim() || !password.trim() || !username.trim()) {
      return Alert.alert(
        "Campos incompletos",
        "Todos los campos son requeridos."
      );
    }

    setIsRegistering(true);
    Keyboard.dismiss();
    await playMusic();

    try {
      console.log("Registering with", { email, password, username });

      const message = await register({ email, password, username });

      Alert.alert("Cuenta creada con éxito", message);

      if (message) {
        setFormType("login");
      }

      setEmail("");
      setPassword("");
      setUsername("");
    } catch (e) {
      const backendMessage =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "No se pudo conectar al servidor.";

      Alert.alert("Error al registrarse", backendMessage);
      console.error("Register failed:", e);
    } finally {
      setIsRegistering(false);
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
        ¡Bienvenido a Pokémon Rivals!
      </Text>
      <TextInput
        value={username}
        onChange={(e) => handleOnChangeTextInput(e, setUsername)}
        placeholder="Username"
        placeholderTextColor="white"
        style={{
          borderWidth: 2,
          borderColor: "white",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 999,
          color: "white",
          width: "100%",
          marginVertical: 8,
          fontSize: 16,
        }}
      />
      <View style={{ width: "100%", alignItems: "center" }}>
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
          <Text style={{ color: "red", marginTop: -5 }}>{emailError}</Text>
        )}
      </View>

      <PasswordInput password={password} setPassword={setPassword} />
      <GlobalButton
        disabled={!ready || isRegistering}
        className={`w-full px-4 py-2 mt-4 rounded-full ${
          !ready
            ? "bg-gray-400"
            : isRegistering
              ? "bg-yellow-200 opacity-50"
              : "bg-yellow-300"
        }`}
        onPress={handleOnPressRegister}
      >
        <Text className="text-center text-xl tracking-widest font-extrabold">
          {!ready
            ? "Cargando recursos..."
            : isRegistering
              ? "Registrando..."
              : "Registrarse"}
        </Text>
      </GlobalButton>
      <View className="mt-4 flex items-center justify-center w-full">
        <Text className=" text-slate-300">¿Ya tienes cuenta? </Text>

        <GlobalButton
          className="bg-slate-300 w-full px-4 py-2 mt-4 rounded-full"
          onPress={() => setFormType("login")}
        >
          <Text className="text-center text-xl tracking-widest font-extrabold">
            Inicia sesion
          </Text>
        </GlobalButton>
      </View>
    </View>
  );
};

export default RegisterForm;
