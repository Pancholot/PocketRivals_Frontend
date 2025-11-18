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
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

const AuthScreen = () => {
  const [formType, setFormType] = useState<"login" | "register">("login");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("@/assets/backgrounds/auth.png")}
        resizeMode="cover"
        className="h-full flex items-center justify-center"
      >
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.60)",
          }}
        />
        {formType == "login" ? (
          <LoginForm setFormType={setFormType} />
        ) : (
          <RegisterForm setFormType={setFormType} />
        )}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;
