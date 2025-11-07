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
import "../global.css";

const HomeScreen = () => {
  const [tareas, setTareas] = useState([
    { id: 1, texto: "Tarea Incompleta 1", completada: false },
    { id: 2, texto: "Tarea Incompleta 2", completada: false },
    { id: 3, texto: "Tarea Completada", completada: true },
  ]);

  const [nuevaTarea, setNuevaTarea] = useState("");

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

  const toogleTarea = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };
  const handleOnChangeText = (e: TextInputChangeEvent) => {
    e.preventDefault();
    setNuevaTarea(e.nativeEvent.text);
  };

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
        {tareas.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-gray-200 text-lg font-bold">
              No hay tareas, crea una nueva!
            </Text>
          </View>
        ) : (
          tareas.map((tarea) => (
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
          ))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
