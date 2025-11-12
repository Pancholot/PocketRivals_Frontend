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
import CaptureBg from "assets/backgrounds/capture.jpg";
import CaptureButtonImage from "assets/icons/capture-button.png";
import { numeroAleatorio } from "functions/helpers";

const capturar = () => {
  const pokemonRandom = numeroAleatorio();
  return (
    <ImageBackground
      source={CaptureBg}
      className="h-full flex flex-col items-center justify-center z-0"
    >
      <Image
        source={{
          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            pokemonRandom
          }.png`,
        }}
      />
      <TouchableOpacity className="w-[65%] h-72">
        <Image
          source={CaptureButtonImage}
          className="w-full h-full z-20"
        ></Image>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default capturar;
