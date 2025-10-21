import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TextInputChangeEvent,
} from "react-native";
import "./global.css";

const App = () => {
  const [tareas, setTareas] = useState([
    { id: 1, texto: "Monkeypox1", completada: false },
    { id: 2, texto: "Aldiablo", completada: false },
    { id: 3, texto: "Thereactor ", completada: true },
  ]);

  const [nuevaTarea, setNuevaTarea] = useState("");

  {
    /* Funcion para agregar una nueva tarea */
  }
  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") return;
    const tarea = {
      id: Date.now(),
      texto: nuevaTarea,
      completada: false,
    };

    setTareas([...tareas, tarea]);
    setNuevaTarea("");
  };

  {
    /* Toggle Cambiar el valor de completado 
        haciendo click en el checkbox*/
  }
  const toogleTarea = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };
  {
    /*Eliminar una tarea*/
  }
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };
  const handleOnChangeText = (e: TextInputChangeEvent) => {
    e.preventDefault();
    setNuevaTarea(e.nativeEvent.text);
  };

  {
    /* Estados de Resumen*/
  }
  const tareasCompletadas = tareas.filter((item) => item.completada).length;
  const totalTareas = tareas.length;
  return (
    <View className="flex-1 bg-purple-600 p-6 pt-16">
      <Text className="text-4xl font-bold text-gray-300"> Mis Tareas</Text>
      <Text className="text-lg text-gray-300">
        {tareasCompletadas} de {totalTareas} completadas
      </Text>
      <View className="flex-row mb-6">
        <TextInput
          className="flex-1 bg-white px-4 py-3 rounded-xl border-2 border-purple-200 text-gray-900"
          placeholder="Escribe una nueva tarea"
          value={nuevaTarea}
          onChange={handleOnChangeText}
        ></TextInput>
        <TouchableOpacity
          className="bg-green-500 ml-4 px-6 py-3 rounded-xl justify-center items-center"
          onPress={agregarTarea}
        >
          <Text className="text-white font-bold text-lg">Agregar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="mb-16">
        {tareas.map((tarea) => (
          <View
            key={tarea.id}
            className="flex-row items-center justify-between bg-purple-200 mb-4 p-4 rounded-xl"
          >
            <TouchableOpacity
              className={`w-6 h-6 border-2 rounded-full mr-4  ${
                tarea.completada
                  ? "bg-green-500 border-green-500"
                  : "border-gray-400"
              }`}
              onPress={() => toogleTarea(tarea.id)}
            ></TouchableOpacity>
            <Text
              className={`flex-1 text-lg ${
                tarea.completada
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }`}
            >
              {tarea.texto}
            </Text>
            <TouchableOpacity onPress={() => eliminarTarea(tarea.id)}>
              <Text className="text-red-500 font-bold text-lg">X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
