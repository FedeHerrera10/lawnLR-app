import CanchaCard from "@/components/ui/canchaCard";
import TennisBallLoader from "@/components/ui/Loader";
import { Cancha } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import { getCanchasByDate } from "@/lib/apis/Canchas";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { LogOut, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HorarioSeleccionado = {
  canchaId: number;
  canchaNombre: string;
  hora: string;
};

export default function UserReservasScreen() {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<Cancha | null>(
    null
  );
  const [horariosSeleccionados, setHorariosSeleccionados] = useState<
    HorarioSeleccionado[]
  >([]);
  const { signOut } = useAuth();

  const {
    data: canchas,
    isLoading,
    error,
  } = useQuery<Cancha[]>({
    queryKey: ["canchasxfecha", fecha],
    queryFn: () => getCanchasByDate(fecha.toISOString().split("T")[0]),
    enabled: true,
    staleTime: 0,
  });

  const toggleSeleccion = (cancha: Cancha, hora: string) => {
    setHorariosSeleccionados((prev) => {
      const existentes = prev.filter((s) => s.canchaId === cancha.id);
      const existe = existentes.some((s) => s.hora === hora);

      const horaEnMinutos = (h: string) => {
        const [hh, mm] = h.split(":").map(Number);
        return hh * 60 + mm;
      };

      if (existe) {
        // Si ya estaba seleccionado, deseleccionamos
        return prev.filter(
          (s) => !(s.canchaId === cancha.id && s.hora === hora)
        );
      }

      if (existentes.length === 0) {
        // Primer horario, siempre permitido
        return [
          ...prev,
          { canchaId: cancha.id, canchaNombre: cancha.nombre, hora },
        ];
      }

      // Validar consecutividad
      const minutosExistentes = existentes.map((s) => horaEnMinutos(s.hora));
      const nuevaHora = horaEnMinutos(hora);
      const min = Math.min(...minutosExistentes);
      const max = Math.max(...minutosExistentes);

      // Solo permitir si nuevaHora es justo antes o justo después
      const paso = 60; // si los turnos son de 1 hora, cambiar si es diferente
      if (nuevaHora === min - paso || nuevaHora === max + paso) {
        return [
          ...prev,
          { canchaId: cancha.id, canchaNombre: cancha.nombre, hora },
        ];
      }
      return prev;
    });
  };

  const handleReservar = () => {
    console.log("Reservando:", horariosSeleccionados);

    router.push("/(tabs)/reserva");

    setHorariosSeleccionados([]);
    setModalVisible(false);
  };

  if (isLoading) return <TennisBallLoader />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!canchas) return <Text>No hay canchas disponibles</Text>;

  return (
    <SafeAreaView className="flex-1 bg-green-700" edges={["top"]}>
      {/* Header */}
      <View className="bg-green-700 px-6 py-4 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <View className="w-6" />
        <Text className="text-white text-2xl font-SoraBold">
          Reservar Cancha
        </Text>
        <TouchableOpacity onPress={() => signOut()}>
          <LogOut size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-gray-50">
        {/* Date Picker */}
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
            <Ionicons name="calendar" size={28} color="green" />
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
                setHorariosSeleccionados([]);
              }
            }}
          />
        )}

        {/* Lista de canchas */}
        <FlatList
          data={canchas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-4"
          renderItem={({ item: cancha }) => (
            <CanchaCard
              key={cancha.id}
              nombre={cancha.nombre}
              superficie="Polvo ladrillo"
              imageId={cancha.id}
              onPress={() => {
                setCanchaSeleccionada(cancha);
                setModalVisible(true);
              }}
            />
          )}
        />

        {/* Modal de horarios */}
        {canchaSeleccionada && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 bg-black/50 justify-center items-center">
              <View className="bg-white w-11/12 rounded-2xl p-6 max-h-[85%]">
                {/* Header modal */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-SoraBold">
                    {canchaSeleccionada.nombre}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="p-2"
                  >
                    <X size={24} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-600 font-SoraMedium mb-3">
                  Selecciona los horarios:
                </Text>

                {/* FlatList de horarios */}
                <FlatList
                  data={[
                    ...(
                      canchaSeleccionada.disponibilidades?.[0]
                        ?.horariosDisponibles || []
                    ).map((h: string) => ({ hora: h, estado: "disponible" })),
                    ...(
                      canchaSeleccionada.disponibilidades?.[0]
                        ?.horariosBloqueados || []
                    ).map((h: string) => ({ hora: h, estado: "bloqueado" })),
                    ...(
                      canchaSeleccionada.disponibilidades?.[0]
                        ?.horariosOcupados || []
                    ).map((h: string) => ({ hora: h, estado: "ocupado" })),
                  ].sort((a, b) => a.hora.localeCompare(b.hora))}
                  keyExtractor={(item) => item.hora}
                  numColumns={3}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  renderItem={({ item }) => {
                    const estaSeleccionado = horariosSeleccionados.some(
                      (s) =>
                        s.canchaId === canchaSeleccionada.id &&
                        s.hora === item.hora
                    );
                    return (
                      <TouchableOpacity
                        key={item.hora}
                        disabled={item.estado !== "disponible"}
                        onPress={() =>
                          toggleSeleccion(canchaSeleccionada, item.hora)
                        }
                        className={`py-3 rounded-xl items-center w-[30%] mb-3 border-2 ${
                          item.estado === "ocupado"
                            ? "border-gray-300 bg-gray-100"
                            : item.estado === "bloqueado"
                            ? "border-red-100 bg-red-50"
                            : estaSeleccionado
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <Text
                          className={`text-sm font-SoraMedium ${
                            item.estado === "ocupado"
                              ? "text-gray-400"
                              : item.estado === "bloqueado"
                              ? "text-red-400"
                              : "text-gray-800"
                          }`}
                        >
                          {item.hora}
                        </Text>
                        <Text
                          className={`text-xs mt-0.5 ${
                            item.estado === "ocupado"
                              ? "text-gray-400"
                              : item.estado === "bloqueado"
                              ? "text-red-300"
                              : estaSeleccionado
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {item.estado === "ocupado"
                            ? "Ocupado"
                            : item.estado === "bloqueado"
                            ? "No disponible"
                            : estaSeleccionado
                            ? "Seleccionado"
                            : "Disponible"}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />

                {/* Botones modal */}
                <View className="flex-row gap-3 justify-between mt-6 pt-4 border-t border-gray-100">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-SoraMedium">
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 py-3 rounded-xl items-center flex-row justify-center gap-2 ${
                      horariosSeleccionados.some(
                        (s) => s.canchaId === canchaSeleccionada.id
                      )
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                    disabled={
                      !horariosSeleccionados.some(
                        (s) => s.canchaId === canchaSeleccionada.id
                      )
                    }
                    onPress={handleReservar}
                  >
                    <Text className="text-white font-SoraBold">
                      {horariosSeleccionados.some(
                        (s) => s.canchaId === canchaSeleccionada.id
                      )
                        ? `Reservar (${
                            horariosSeleccionados.filter(
                              (s) => s.canchaId === canchaSeleccionada.id
                            ).length
                          })`
                        : "Reservar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}
