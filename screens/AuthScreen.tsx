import {
  View,
  Text,
  TextInput,
  TextInputChangeEvent,
  TouchableOpacity,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { logIn } from "api/apiService";

const AuthScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleOnChangeTextInput = (
    e: TextInputChangeEvent,
    func: Dispatch<SetStateAction<string>>
  ) => {
    func(e.nativeEvent.text);
  };
  const handleOnPressLogIn = async () => {
    console.log("Logging in with", { email, password });
    const message = await logIn({ email, password });
    console.log(message);
    setEmail("");
    setPassword("");
  };
  return (
    <View className="flex-1 justify-center items-center bg-blue-950">
      <Text className="color-white">Login</Text>
      <TextInput
        className="border-2 border-white w-3/4 p-2 my-2 rounded text-white"
        value={email}
        onChange={(e) => handleOnChangeTextInput(e, setEmail)}
        placeholder="Email"
        placeholderTextColor={"gray"}
      ></TextInput>
      <TextInput
        className="border-2 border-white w-3/4 p-2 my-2 rounded text-white"
        value={password}
        onChange={(e) => handleOnChangeTextInput(e, setPassword)}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={"gray"}
      ></TextInput>
      <TouchableOpacity
        className="bg-white px-4 py-2 rounded mt-4"
        onPress={handleOnPressLogIn}
      >
        <Text>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;
