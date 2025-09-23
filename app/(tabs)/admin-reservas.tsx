// app/(tabs)/admin-reservas.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

// 🔹 Ejemplo de reservas de todos los usuarios
const mockReservas = [
  {
    id: 1,
    usuario: "Juan Pérez",
    cancha: "Cancha 1",
    fecha: "2025-09-20",
    hora: "09:00",
    precio: 1750,
  },
  {
    id: 2,
    usuario: "María López",
    cancha: "Cancha 3",
    fecha: "2025-09-21",
    hora: "18:00",
    precio: 2100,
  },
  {
    id: 3,
    usuario: "Carlos Díaz",
    cancha: "Cancha 2",
    fecha: "2025-09-22",
    hora: "11:00",
    precio: 1960,
  },
];

export default function AdminReservas() {
  const [reservas, setReservas] = useState<typeof mockReservas>([]);

  useEffect(() => {
    // Aquí en el futuro vas a llamar al backend: fetch("/api/reservas")
    setReservas(mockReservas);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 ">
      {/* Header */}
      <View className="bg-green-700 px-6 py-8 rounded-b-3xl shadow-md ">
        <Text className="text-white text-2xl  mt-10 font-bold">Todas las Reservas</Text>
      </View>

      <ScrollView className="p-4">
        {reservas.map((r) => (
          <View
            key={r.id}
            className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200"
          >
            <Text className="text-lg font-bold text-green-700">
              {r.usuario}
            </Text>
            <Text className="text-gray-600">
              📍 {r.cancha} - {r.fecha} {r.hora}
            </Text>
            <Text className="text-gray-800 font-semibold mt-1">
              💵 ${r.precio}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}