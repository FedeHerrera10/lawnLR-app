import TennisBallLoader from "@/components/ui/Loader";
import { Cancha } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import { getCanchasByDate } from "@/lib/apis/Canchas";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { LogOut, Settings2, ShieldBan } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Administracion() {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const { signOut } = useAuth();

  const { data, error, isLoading } = useQuery({
    queryKey: ["canchasxfecha"],
    queryFn: () => getCanchasByDate(fecha.toISOString().split("T")[0]),
    enabled: true,
    staleTime: 0,
  });

  const [bloqueados, setBloqueados] = useState<
    Record<string, { cancha: string; hora: string }[]>
  >({});

  useEffect(() => {
    if (data && isLoading === false) setBloqueados(data);
  }, [data, isLoading]);

  if (isLoading) return <TennisBallLoader />;
  if (error) return <Text>Error: {error.message}</Text>;

  // horarios bloqueados por fecha

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

  const handleGuardarBloqueos = () => {
    Alert.alert("Guardar bloqueos", "¿Estás seguro de guardar los bloqueos?", [
      { text: "Cancelar", onPress: () => console.log("Cancelado") },
      {
        text: "Guardar",
        onPress: () =>
          Toast.show({
            type: "success",
            text1: "Actualizado correctamente",
            text1Style: { fontSize: 16 },
          }),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <View className="bg-red-700 px-6 py-8 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.85}
          className=" "
          onPress={() => router.push("/(tabs)/canchas/admin-canchas")}
        >
          <Settings2 size={22} color="white" style={{ marginTop: 32 }} />
        </TouchableOpacity>
        <Text className="text-white mt-10 text-2xl font-SoraBold">
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
            <Text className="text-gray-500 text-sm font-SoraMedium">
              Seleccionar fecha
            </Text>
            <Text className="text-lg font-SoraBold text-red-700 mt-1 ">
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
        {data?.map((cancha: Cancha) => (
          <View
            key={cancha.id}
            className="bg-white rounded-2xl shadow-md p-4 mb-6"
          >
            <View className="flex-row  justify-between">
              <View className="flex-col">
                <Text className="text-lg font-bold text-gray-800 mb-2 font-SoraBold">
                  {cancha.nombre}
                </Text>
                <Text className="text-gray-500 mb-3 font-SoraMedium">
                  {"Polvo ladrillo"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleGuardarBloqueos()}>
                <ShieldBan size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
            {cancha.disponibilidades?.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mt-2">
                {cancha.disponibilidades
                  .filter((h) => h.horariosDisponibles?.length > 0) // solo con horarios
                  .map((h, index) => {
                    const { horariosDisponibles } = h;

                    return horariosDisponibles.map((horario, i) => {
                      const bloqueado = isBloqueado(cancha.nombre, horario);
                      return (
                        <TouchableOpacity
                          key={`${index}-${i}`}
                          className={`px-3 py-4 rounded-full border w-[28%] items-center font-SoraMedium
              ${
                bloqueado
                  ? "bg-red-600 border-red-600"
                  : "bg-green-100 border-green-500"
              }`}
                          onPress={() => {
                            toggleBloqueo(cancha.nombre, horario);
                          }}
                        >
                          <Text
                            className={`font-SoraBold ${
                              bloqueado ? "text-white" : "text-green-700"
                            }`}
                          >
                            {horario} hs.
                          </Text>
                        </TouchableOpacity>
                      );
                    });
                  })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
