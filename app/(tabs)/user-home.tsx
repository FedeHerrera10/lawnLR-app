import TennisBallLoader from "@/components/ui/Loader";
import { Cancha } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import { getCanchasByDate } from "@/lib/apis/Canchas";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ArrowRightIcon, LogOut } from "lucide-react-native";
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

export default function UserReservasScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [seleccionados, setSeleccionados] = useState<
    {
      canchaId: number;
      canchaNombre: string;
      hora: string;
    }[]
  >([]);

  const {
    data: canchas,
    error,
    isLoading,
  } = useQuery<Cancha[]>({
    queryKey: ["canchasxfecha", fecha.toISOString().split("T")[0]],
    queryFn: () => getCanchasByDate(fecha.toISOString().split("T")[0]),
    enabled: true,
    staleTime: 0,
  });

  const toggleSeleccion = (
    canchaId: number,
    canchaNombre: string,
    hora: string
  ) => {
    setSeleccionados((prev) => {
      // Verificar si ya está seleccionada esta hora para esta cancha
      const existe = prev.some(
        (s) => s.canchaId === canchaId && s.hora === hora
      );

      // Si ya existe la quitamos, si no existe la agregamos
      if (existe) {
        return prev.filter((s) => !(s.canchaId === canchaId && s.hora === hora));
      }

      // Si es la primera selección o es de la misma cancha, la agregamos
      if (prev.length === 0 || prev[0].canchaId === canchaId) {
        return [...prev, { canchaId, canchaNombre, hora }];
      }

      // Si intenta seleccionar de otra cancha, mostramos error
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Solo puedes seleccionar horarios de una misma cancha",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 16 },
      });
      return prev;
    });
  };

  const isSeleccionado = (canchaId: number, hora: string) => {
    return seleccionados.some(
      (s) => s.canchaId === canchaId && s.hora === hora
    );
  };

  const handleReservar = () => {
    if (seleccionados.length === 0) {
      Toast.show({
        type: "error",
        text1: "Ups!",
        text2: "Debes seleccionar al menos un horario",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 16 },
      });
      return;
    }
  
    // Navegar a la pantalla de reserva con los datos
    router.push({
      pathname: '/(tabs)/reserva',
      params: {
        seleccionados: JSON.stringify(seleccionados)
      }
    });
  };

  if (isLoading) {
    return <TennisBallLoader />;
  }

  if (error) {
    return (
      <Text className="p-4">Error al cargar las canchas: {error.message}</Text>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-green-700 px-6 pt-16 pb-6 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <View style={{ width: 22 }} />
        <Text className="text-white text-2xl font-SoraBold text-center">
          Reservar
        </Text>
        <TouchableOpacity activeOpacity={0.85} onPress={signOut}>
          <LogOut size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Selector de fecha */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => setMostrarDatePicker(true)}
          activeOpacity={0.85}
          className="w-full bg-white rounded-2xl shadow-md px-6 py-4 flex-row items-center justify-between border border-green-200"
        >
          <View>
            <Text className="text-gray-500 text-sm font-SoraMedium">
              Seleccionar fecha
            </Text>
            <Text className="text-lg font-SoraBold text-green-700 mt-1">
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
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
          onChange={(_, selectedDate) => {
            setMostrarDatePicker(false);
            if (selectedDate) {
              setFecha(selectedDate);
              setSeleccionados([]);
            }
          }}
        />
      )}

      {/* Lista de canchas y horarios */}
      <ScrollView className="p-4">
        {canchas?.map((cancha) => (
          <View
            key={cancha.id}
            className="bg-white rounded-2xl shadow-md p-4 mb-6"
          >
            <View className="flex-col">
              <Text className="text-lg font-bold text-gray-800 mb-1 font-SoraBold">
                {cancha.nombre}
              </Text>
              <Text className="text-gray-500 mb-3 font-SoraMedium">
                Polvo de ladrillo
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2 mt-2">
              {cancha.disponibilidades?.map((disp) =>
                disp.horariosDisponibles?.map((hora, index) => {
                  const estaSeleccionado = isSeleccionado(cancha.id, hora);
                  return (
                    <TouchableOpacity
                      key={`${cancha.id}-${hora}`}
                      className={`px-3 py-3 rounded-full border w-[30%] items-center ${
                        estaSeleccionado
                          ? "bg-green-600 border-green-600"
                          : "bg-green-100 border-green-500"
                      }`}
                      onPress={() =>
                        toggleSeleccion(cancha.id, cancha.nombre, hora)
                      }
                    >
                      <Text
                        className={`font-SoraBold ${
                          estaSeleccionado ? "text-white" : "text-green-700"
                        }`}
                      >
                        {hora} hs.
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón de reservar */}
      {seleccionados.length > 0 && (
        <View className="p-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            className="bg-green-600 py-4 rounded-2xl flex-row items-center justify-center"
            onPress={handleReservar}
          >
            <Text className="text-white font-SoraBold text-lg">
              Reservar {seleccionados.length} hora
              {seleccionados.length !== 1 ? "s" : ""} ({seleccionados[0].hora} -{" "}
              {seleccionados[seleccionados.length - 1].hora})
            </Text>
            <ArrowRightIcon size={20} color="white" className="ml-2" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
