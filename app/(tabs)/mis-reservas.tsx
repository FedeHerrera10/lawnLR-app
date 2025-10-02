import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Datos de ejemplo
const reservas = [
  { id: 1, cancha: "Cancha 3", fecha: "2025-09-20", horaInicio: "18:00", horaFin: "19:00", total: 2100, estado: "PAGADA" },
  { id: 2, cancha: "Cancha 1", fecha: "2025-09-15", horaInicio: "09:00", horaFin: "10:00", total: 1750, estado: "CANCELADA" },
  { id: 3, cancha: "Cancha 5", fecha: "2025-08-30", horaInicio: "17:00", horaFin: "18:00", total: 2100, estado: "PENDIENTE" },
  { id: 4, cancha: "Cancha 2", fecha: "2025-09-28", horaInicio: "15:00", horaFin: "16:00", total: 2100, estado: "PAGADA" },
];

type EstadoReserva = "TODAS" | "PAGADA" | "PENDIENTE" | "CANCELADA";

const filtros: { label: string; value: EstadoReserva }[] = [
  { label: "Todas", value: "TODAS" },
  { label: "Pagadas", value: "PAGADA" },
  { label: "Pendientes", value: "PENDIENTE" },
  { label: "Canceladas", value: "CANCELADA" },
];

const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "PAGADA":
      return "bg-green-100 text-green-700 border-green-400";
    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-700 border-yellow-400";
    case "CANCELADA":
      return "bg-red-100 text-red-700 border-red-400";
    default:
      return "bg-gray-100 text-gray-500 border-gray-300";
  }
};

export default function MisReservasScreen() {
  const { signOut } = useAuth();
  const [filtroActivo, setFiltroActivo] = useState<EstadoReserva>("TODAS");

  // Función simplificada de cierre de sesión
  const handleSignOut = () => {
    try {
      signOut();
      // La navegación se manejará en el AuthProvider
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Filtrar reservas
  const reservasFiltradas = filtroActivo === "TODAS"
    ? reservas
    : reservas.filter(r => r.estado === filtroActivo);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-green-700 px-6 pt-16 pb-6 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <View style={{ width: 22 }} />
        <Text className="text-white text-2xl font-SoraBold text-center">
          Mis Reservas
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          className="ml-3"
          onPress={handleSignOut}
        >
          <LogOut size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        >
          {filtros.map(({ label, value }) => {
            const activo = filtroActivo === value;
            return (
              <TouchableOpacity
                key={value}
                onPress={() => setFiltroActivo(value)}
                className={`px-4 py-2 rounded-full mr-3 ${
                  activo ? "bg-green-600" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    activo ? "text-white" : "text-gray-600"
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de reservas */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {reservasFiltradas.map((r) => (
          <View
            key={r.id}
            className="bg-white rounded-2xl shadow-md p-5 mb-4 border border-gray-100"
          >
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
            <Text className="text-gray-600">💲 Total: ${r.total}</Text>
          </View>
        ))}

        {reservasFiltradas.length === 0 && (
          <View className="bg-white rounded-2xl p-6 items-center justify-center">
            <Text className="text-gray-500 text-center">
              No hay reservas {filtroActivo === "TODAS" ? "" : `en estado ${filtroActivo.toLowerCase()}`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}