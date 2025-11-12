import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { secureStore } from "functions/secureStore";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import CaptureBg from "@/assets/backgrounds/capture.jpg";
import CaptureButtonImage from "@/assets/icons/capture-button.png";
import { numeroAleatorio } from "functions/helpers";
import AnimacionDeLadoALado from "components/AnimatedPokemon";

const capturar = () => {
  const posiciones = [123];
  return (
    <ImageBackground
      source={CaptureBg}
      className="h-full flex flex-col items-center justify-center z-0"
    >
      {posiciones.map((numero) => (
        <AnimacionDeLadoALado position1={numero} key={numero} />
      ))}

      <TouchableOpacity className="w-72 h-72">
        <Image
          source={CaptureButtonImage}
          className="w-full h-full z-20"
        ></Image>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default capturar;
