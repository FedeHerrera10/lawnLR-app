import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

// Horarios base
const horariosBase = [
  { hora: "08:00", precio: 1750, estado: "disponible" },
  { hora: "09:00", precio: 1750, estado: "ocupado" },
  { hora: "10:00", precio: 1750, estado: "disponible" },
  { hora: "11:00", precio: 1960, estado: "limitado" },
  { hora: "12:00", precio: 1960, estado: "disponible" },
  { hora: "13:00", precio: 1960, estado: "disponible" },
  { hora: "14:00", precio: 1960, estado: "ocupado" },
  { hora: "15:00", precio: 2100, estado: "disponible" },
  { hora: "16:00", precio: 2100, estado: "disponible" },
  { hora: "17:00", precio: 2100, estado: "ocupado" },
  { hora: "18:00", precio: 2100, estado: "disponible" },
  { hora: "19:00", precio: 2100, estado: "disponible" },
];


// Canchas
const canchas = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  nombre: `Cancha ${i + 1}`,
  superficie: "Polvo de Ladrillo",
  disponible: true,
  horarios: horariosBase,
}));

// 🎨 Estilos
const getStyle = (estado: string, seleccionado: boolean) => {
  if (seleccionado) return "bg-green-600 border-green-600 text-white";
  switch (estado) {
    case "disponible":
      return "bg-green-100 border-green-500 text-green-700";
    default:
      return "hidden";
  }
};

export default function UserReservasScreen() {
  const [seleccionados, setSeleccionados] = useState<
    { cancha: string; hora: string; precio: number }[]
  >([]);

  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  // 🛑 Horarios bloqueados (simulado, después vendrá del backend)
  const bloqueados: Record<string, { cancha: string; hora: string }[]> = {
    "2025-09-20": [
      { cancha: "Cancha 1", hora: "10:00" },
      { cancha: "Cancha 3", hora: "15:00" },
    ],
  };
  

  const fechaKey = fecha.toISOString().split("T")[0];

  // 📌 Verifica consecutividad
  const toggleSeleccion = (cancha: string, hora: string, precio: number) => {
    const yaSeleccionado = seleccionados.find(
      (s) => s.cancha === cancha && s.hora === hora
    );

    if (yaSeleccionado) {
      setSeleccionados(
        seleccionados.filter((s) => !(s.cancha === cancha && s.hora === hora))
      );
      return;
    }

    if (seleccionados.length === 0) {
      setSeleccionados([{ cancha, hora, precio }]);
      return;
    }

    const horasSeleccionadas = seleccionados.map((s) => s.hora);
    const ultima = horasSeleccionadas[horasSeleccionadas.length - 1];
    const ultimaIndex = horariosBase.findIndex((h) => h.hora === ultima);
    const actualIndex = horariosBase.findIndex((h) => h.hora === hora);

    if (actualIndex === ultimaIndex + 1) {
      setSeleccionados([...seleccionados, { cancha, hora, precio }]);
    } else {
       Toast.show({
         type: "error",
         text1: "Ups!",
         text2: "Solo puedes elegir horarios consecutivos",
         text1Style: { fontSize: 18 },
         text2Style: { fontSize: 15 },
       });
    }
  };

  // 🚀 Avanzar
  const avanzar = () => {
    if (seleccionados.length === 0) {
      Toast.show({
        type: "error",
        text1: "Ups!",
        text2: "Selecciona al menos un horario",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 15 },
      });
      return;
    }

    router.push({
      pathname: "/reserva",
      params: {
        fecha: fechaKey,
        seleccionados: JSON.stringify(seleccionados),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 ">
      {/* Header */}
      <View className="bg-green-700 px-6 py-8 rounded-b-3xl shadow-md">
        <Text className="text-white text-2xl mt-10 font-bold">Reservar Cancha</Text>
      </View>

      {/* Selector de fecha */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => setMostrarDatePicker(true)}
          activeOpacity={0.85}
          className="w-full bg-white rounded-2xl shadow-md px-6 py-4 flex-row items-center justify-between border border-green-200"
        >
          <View>
            <Text className="text-gray-500 text-sm">Seleccionar fecha</Text>
            <Text className="text-lg font-semibold text-green-700 mt-1">
              {fecha.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
          <Ionicons name="calendar" size={28} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {mostrarDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          textColor="black"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
          onChange={(_, selectedDate) => {
            setMostrarDatePicker(false);
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

      {/* Body */}
      <ScrollView className="p-4">
        {canchas.map((cancha) => (
          <View
            key={cancha.id}
            className="bg-white rounded-2xl shadow-md p-4 mb-6"
          >
            <Text className="text-lg font-bold text-gray-800 mb-2">
              {cancha.nombre}
            </Text>
            <Text className="text-gray-500 mb-3">{cancha.superficie}</Text>

            <View className="flex-row flex-wrap gap-2">
              {cancha.horarios
                .filter(
                  (h) =>
                    h.estado === "disponible" &&
                    !(bloqueados[fechaKey] || []).some(
                      (b) => b.cancha === cancha.nombre && b.hora === h.hora
                    )
                )
                .map((h, index) => {
                  const isSelected = seleccionados.some(
                    (s) => s.cancha === cancha.nombre && s.hora === h.hora
                  );
                  return (
                    <TouchableOpacity
                      key={index}
                      className={`px-3 py-2 rounded-full border ${getStyle(
                        h.estado,
                        isSelected
                      )} w-[28%] items-center`}
                      onPress={() =>
                        toggleSeleccion(cancha.nombre, h.hora, h.precio ?? 0)
                      }
                    >
                      <Text
                        className={`font-semibold ${
                          isSelected ? "text-white" : ""
                        }`}
                      >
                        {h.hora}
                      </Text>
                      <Text
                        className={`text-xs ${
                          isSelected ? "text-white" : "text-gray-700"
                        }`}
                      >
                        ${h.precio}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón avanzar */}
      <TouchableOpacity
        onPress={avanzar}
        className="absolute bottom-6 left-6 right-6 bg-green-700 py-4 rounded-2xl items-center shadow-lg flex-row justify-center gap-2"
      >
        
        <Text className="text-white font-semibold text-xl">Avanzar</Text>
        <ArrowRightIcon className="w-6 h-6 text-white text-semibold" color="white" strokeWidth={3} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}