import { View, Text } from "react-native";
import React from "react";
import { secureStore } from "functions/secureStore";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const capturar = () => {
  useEffect(() => {
    console.log();
  }, []);
  return (
    <View>
      <Text>Bienvenido</Text>
    </View>
  );
};

export default capturar;
