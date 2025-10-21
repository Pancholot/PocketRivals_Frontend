import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import "./global.css"

const App = () => {
  const [tareas, setTareas] = useState([
    { id: 1, texto: "Monkeypox1", completada: false },
    { id: 2, texto: "Aldiablo", completada: false },
    { id: 3, texto: "Thereactor ", completada: true }
  ]);

  const [nuevaTarea, setNuevaTarea] = useState('')

  {/* Funcion para agregar una nueva tarea */}
  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return
    const tarea = {
      id: Date.now(),
      texto: nuevaTarea,
      completada: false
    }

    setTareas([...tareas, tarea]);
    setNuevaTarea('');

    {/* Toggle Cambiar el valor de completado 
        haciendo click en el checkbox*/}
    const toogleTarea = (id) => {
      setTareas(tareas.map(tarea => 
        tarea.id === id ? {...tarea, completada: !tarea.completada} : tarea
      ))
    }
    {/*Eliminar una tarea*/}
    const eliminarTarea = (id) => {
      setTareas(tareas.filter(tarea => tarea.id !== id))
    }

    {/* Estados de Resumen*/}
    const tareasCompletadas = tareas.filter(item => item.completada).length
    const totalTareas = tareas.length
    return (
      <View className='flex-1 bg-purple-800 p-6 pt-16'>
        <Text className='text-4xl font-bold text-gray-900'> Mis Tareas</Text>
        <Text className='text-lg text-gray-600'>
          {tareasCompletadas} de {totalTareas} completadas
        </Text>
      </View>
    )
  }
};

export default App