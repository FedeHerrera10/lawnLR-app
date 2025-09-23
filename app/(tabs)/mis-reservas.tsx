import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View
} from "react-native";

// 🔹 Datos simulados por ahora
const reservas = [
  {
    id: 1,
    cancha: "Cancha 3",
    fecha: "2025-09-20",
    horaInicio: "18:00",
    horaFin: "19:00",
    total: 2100,
    estado: "PAGADA",
  },
  {
    id: 2,
    cancha: "Cancha 1",
    fecha: "2025-09-15",
    horaInicio: "09:00",
    horaFin: "10:00",
    total: 1750,
    estado: "CANCELADA",
  },
  {
    id: 3,
    cancha: "Cancha 5",
    fecha: "2025-08-30",
    horaInicio: "17:00",
    horaFin: "18:00",
    total: 2100,
    estado: "PENDIENTE",
  },
];

const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "PAGADA":
      return "bg-green-100 text-green-700 border-green-400";
    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-700 border-yellow-400";
    case "CANCELADA":
      return "bg-red-100 text-red-700 border-red-400";
    case "NO_SHOW":
      return "bg-gray-200 text-gray-600 border-gray-300";
    default:
      return "bg-gray-100 text-gray-500 border-gray-300";
  }
};

export default function MisReservasScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-16">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-3xl font-extrabold text-green-700 mb-6">
          Mis Reservas
        </Text>

        {reservas.map((r) => (
          <View
            key={r.id}
            className="bg-white rounded-2xl shadow-md p-5 mb-5 border border-gray-100"
          >
            {/* Encabezado */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-800">
                {r.cancha}
              </Text>
              <Text
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoStyle(
                  r.estado
                )}`}
              >
                {r.estado}
              </Text>
            </View>

            {/* Detalles */}
            <Text className="text-gray-600 mb-1">
              📅{" "}
              {new Date(r.fecha).toLocaleDateString("es-AR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text className="text-gray-600 mb-1">
              ⏰ {r.horaInicio} - {r.horaFin}
            </Text>
            <Text className="text-gray-600 mb-1">💲 Total: ${r.total}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}