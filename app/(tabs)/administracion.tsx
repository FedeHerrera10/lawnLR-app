import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { LogOut, Settings2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const horariosBase = [
  { hora: "08:00", precio: 1750 },
  { hora: "09:00", precio: 1750 },
  { hora: "10:00", precio: 1750 },
  { hora: "11:00", precio: 1960 },
  { hora: "12:00", precio: 1960 },
  { hora: "13:00", precio: 1960 },
  { hora: "14:00", precio: 1960 },
  { hora: "15:00", precio: 2100 },
  { hora: "16:00", precio: 2100 },
  { hora: "17:00", precio: 2100 },
  { hora: "18:00", precio: 2100 },
  { hora: "19:00", precio: 2100 },
];

const canchas = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  nombre: `Cancha ${i + 1}`,
  superficie: "Polvo de Ladrillo",
  horarios: horariosBase,
}));

export default function Administracion() {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const { signOut } = useAuth();

  // horarios bloqueados por fecha
  const [bloqueados, setBloqueados] = useState<
    Record<string, { cancha: string; hora: string }[]>
  >({});

  const fechaKey = fecha.toISOString().split("T")[0];

  const toggleBloqueo = (cancha: string, hora: string) => {
    const actuales = bloqueados[fechaKey] || [];
    const ya = actuales.find((s) => s.cancha === cancha && s.hora === hora);

    if (ya) {
      // 🔓 desbloquear
      setBloqueados({
        ...bloqueados,
        [fechaKey]: actuales.filter(
          (s) => !(s.cancha === cancha && s.hora === hora)
        ),
      });
    } else {
      // 🔒 bloquear
      setBloqueados({
        ...bloqueados,
        [fechaKey]: [...actuales, { cancha, hora }],
      });
    }
  };

  const isBloqueado = (cancha: string, hora: string) =>
    (bloqueados[fechaKey] || []).some(
      (b) => b.cancha === cancha && b.hora === hora
    );

 

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="bg-red-700 px-6 py-8 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <TouchableOpacity activeOpacity={0.85} className=" " onPress={() => router.push("/(tabs)/canchas/admin-canchas")}>
          <Settings2 size={22} color="white" style={{ marginTop: 32 }} />
        </TouchableOpacity>
        <Text className="text-white mt-10 text-2xl font-bold">
          Administración de Canchas
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          className=" "
          onPress={() => signOut()}
        >
          <LogOut size={22} color="white" style={{ marginTop: 32 }} />
        </TouchableOpacity>
      </View>

      {/* Selector de fecha estilo card */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => setMostrarDatePicker(true)}
          activeOpacity={0.85}
          className="w-full bg-white rounded-2xl shadow-md px-6 py-4 flex-row items-center justify-between border border-red-200"
        >
          <View>
            <Text className="text-gray-500 text-sm">Seleccionar fecha</Text>
            <Text className="text-lg font-semibold text-red-700 mt-1">
              {fecha.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
          <Ionicons name="calendar" size={28} color="#dc2626" />
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
              {cancha.horarios.map((h, index) => {
                const bloqueado = isBloqueado(cancha.nombre, h.hora);
                return (
                  <TouchableOpacity
                    key={index}
                    className={`px-3 py-2 rounded-full border w-[28%] items-center
                      ${
                        bloqueado
                          ? "bg-red-600 border-red-600"
                          : "bg-green-100 border-green-500"
                      }`}
                    onPress={() => toggleBloqueo(cancha.nombre, h.hora)}
                  >
                    <Text
                      className={`font-semibold ${
                        bloqueado ? "text-white" : "text-green-700"
                      }`}
                    >
                      {h.hora}
                    </Text>
                    <Text
                      className={`text-xs ${
                        bloqueado ? "text-white" : "text-gray-700"
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
    </SafeAreaView>
  );
}
