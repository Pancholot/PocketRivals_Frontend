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
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { logIn } from "api/apiService";
import { useRouter } from "expo-router";

const AuthScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const handleOnChangeTextInput = (
    e: TextInputChangeEvent,
    func: Dispatch<SetStateAction<string>>
  ) => {
    func(e.nativeEvent.text);
  };
  const handleOnPressLogIn = async () => {
    Keyboard.dismiss();
    try {
      console.log("Logging in with", { email, password });
      const message = await logIn({ email, password });
      if (message == "Bienvenido") {
        Alert.alert("Bienvenido");
        router.replace("/capturar");
      }
      setEmail("");
      setPassword("");
    } catch (e) {
      Alert.alert("Error al iniciar sesión", e.message);
      console.error("Login failed:", e);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/background.jpg")} // 👈 tu imagen local
        resizeMode="cover" // o "contain" según el efecto que quieras
        className="flex-1 justify-center items-center"
      ></ImageBackground>
      <View className="flex-1 justify-center items-center bg-red-900">
        <Image
          source={require("../assets/pokeball_icon.png")} // path to your local image
          style={{ width: 200, height: 200, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text className="color-white">Login</Text>
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
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;
