import {
  View,
  Text,
  Image,
  TextInput,
  TextInputChangeEvent,
  Keyboard,
  GestureResponderEvent,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useMusic } from "contexts/MusicContext";
import { useRouter } from "expo-router";
import GlobalButton from "./GlobalButton";
import { usePreload } from "contexts/PreloadContext";

const RegisterForm = ({ setFormType }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { playMusic } = useMusic();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const { ready } = usePreload();

  const handleOnChangeTextInput = (
    e: TextInputChangeEvent,
    func: Dispatch<SetStateAction<string>>
  ) => {
    func(e.nativeEvent.text);
  };
  const handleOnPressRegister = async () => {
    if (isRegistering) return;
    setIsRegistering(true);
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
    setIsRegistering(false);
  };

  return (
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
        className="border-2 border-white p-2 my-2  text-white w-full rounded-full"
        value={username}
        onChange={(e) => handleOnChangeTextInput(e, setUsername)}
        placeholder="Username"
        placeholderTextColor={"white"}
      ></TextInput>
      <TextInput
        className="border-2 border-white p-2 my-2  text-white w-full rounded-full"
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
              : "Registrar"}
        </Text>
      </GlobalButton>
      <View className="mt-4 flex items-center justify-center w-full">
        <Text className=" text-slate-300">Ya tienes cuenta? </Text>

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
