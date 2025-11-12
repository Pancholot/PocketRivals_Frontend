import { numeroAleatorio, selectRandomTop, topValues } from "functions/helpers";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { StyleSheet } from "react-native";

const AnimacionDeLadoALado = ({ position1 }) => {
  // 1. Crear un Animated.Value.
  //    Lo inicializamos en 0, que será la posición inicial (izquierda).
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const pokemonRandom = numeroAleatorio();
  console.log(pokemonRandom);

  useEffect(() => {
    // 2. Definir la secuencia de animación
    const animationSequence = Animated.sequence([
      // Ir de izquierda a derecha (0 a 100% de la distancia disponible)
      Animated.timing(translateXAnim, {
        toValue: 1, // Nuestro valor objetivo, lo usaremos para calcular la posición real
        duration: 3000, // Duración en milisegundos (3 segundos)
        easing: Easing.linear, // Tipo de aceleración (lineal es constante)
        useNativeDriver: true, // Usa el driver nativo para mejor rendimiento
      }),
      // Ir de derecha a izquierda (100% a 0)
      Animated.timing(translateXAnim, {
        toValue: 0,
        duration: 3000,
        easing: Easing.cubic,
        useNativeDriver: true,
      }),
    ]);

    // 3. Iniciar la animación en bucle (loop)
    //    Esto hará que la secuencia se repita indefinidamente
    Animated.loop(animationSequence, {
      iterations: -1,
    }).start();
  }, [translateXAnim]); // Dependencia: re-ejecuta si translateXAnim cambia (aunque no debería)

  // 4. Calcular el estilo animado
  //    Mapeamos el valor de translateXAnim (de 0 a 1) a un rango de píxeles
  const animatedStyle = {
    transform: [
      {
        translateX: translateXAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [position1, 300], // <-- CAMBIA ESTO: De 0px a 200px.
          // Ajusta 200 al ancho de tu área de movimiento
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        className={`${topValues[selectRandomTop(position1)]}`}
        source={{
          uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            pokemonRandom
          }.png`,
        }} // Tu sprite de Pokémon
        style={[styles.pokemonSprite, animatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%", // Altura de tu área de animación
    position: "absolute",
    backgroundColor: "transparent", // Para ver el contenedor
    overflow: "hidden", // Importante para que el sprite no se salga
    justifyContent: "flex-end", // Centra el sprite verticalmente en el contenedo
  },
  pokemonSprite: {
    width: 200, // Tamaño de tu sprite
    height: 200,
    position: "absolute", // Podrías usar position absolute para control más fino
    bottom: 0, // Si usas position absolute, este sería el punto de partida
  },
});

export default AnimacionDeLadoALado;
