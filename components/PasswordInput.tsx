import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function PasswordInput({
  password,
  setPassword,
}: {
  password: string;
  setPassword: (val: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={{
        width: "100%",
        position: "relative",
        justifyContent: "center",
        marginVertical: 8,
      }}
    >
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="white"
        secureTextEntry={!showPassword}
        style={{
          borderWidth: 2,
          borderColor: "white",
          paddingVertical: 10,
          paddingHorizontal: 15,
          paddingRight: 45,
          borderRadius: 9999,
          color: "white",
          fontSize: 16,
        }}
      />

      {/* Icono */}
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: 15,
          top: "50%",
          transform: [{ translateY: -12 }],
        }}
      >
        <Feather
          name={showPassword ? "eye" : "eye-off"}
          size={22}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}
