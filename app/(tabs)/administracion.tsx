import CanchaCard from "@/components/ui/canchaCard";
import CustomToast from "@/components/ui/CustomToast";
import CustomHeader from "@/components/ui/layout/CustomHeader";
import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
import TennisBallLoader from "@/components/ui/Loader";
import { Cancha } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import {
  bloquearHorario,
  desbloquearHorario,
  getCanchasByDate,
} from "@/lib/apis/Canchas";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { LogOut, Settings2, ShieldBan, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Administracion() {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  /**
   * Estados del componente.
   */
  const [modalVisible, setModalVisible] = useState(false);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<Cancha | null>(null);
  const [bloqueadosOriginales, setBloqueadosOriginales] = useState<string[]>([]);
  const [bloqueadosTemp, setBloqueadosTemp] = useState<string[]>([]);
  const [desbloqueados, setDesbloqueados] = useState<string[]>([]);
  const fechaKey = fecha.toISOString().split("T")[0];
  
  
  /**
   * @description Obtiene las canchas disponibles para la fecha seleccionada
   */
  const { data, error, isLoading } = useQuery({
    queryKey: ["canchasxfecha", fecha],
    queryFn: () => getCanchasByDate(fechaKey),
    enabled: !!fecha,
    staleTime: 0,
  });

  /**
   * @description Bloquea los horarios de una cancha
   */
  const bloquearMutation = useMutation({
    mutationFn: bloquearHorario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canchasxfecha", fecha] });
      CustomToast({type: "success", title: "Success", message: "Bloqueos guardados correctamente" });
    },
    onError: (error: any) => {
      CustomToast({type: "error", title: "Error", message: error.message });
    },
  });

  /**
   * @description Desbloquea los horarios de una cancha
   */
  const desbloquearMutation = useMutation({
    mutationFn: desbloquearHorario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canchasxfecha", fecha] });
      CustomToast({type: "success", title: "Success", message: "Desbloqueos guardados correctamente" });
    },
    onError: (error: any) => {
      CustomToast({type: "error", title: "Error", message: error.message });
    },
  });

  /**
   * @description Togglea el bloqueo de una hora
   * @param hora Hora a bloquear/desbloquear
   */
  const toggleBloqueo = (hora: string) => {
    const estabaBloqueadoOriginal = bloqueadosOriginales.includes(hora);

    if (bloqueadosTemp.includes(hora)) {
      // Desbloquear
      setBloqueadosTemp((prev) => prev.filter((h) => h !== hora));
      if (estabaBloqueadoOriginal) {
        setDesbloqueados((prev) => [...prev, hora]);
      }
    } else {
      // Bloquear
      setBloqueadosTemp((prev) => [...prev, hora]);
      if (desbloqueados.includes(hora)) {
        setDesbloqueados((prev) => prev.filter((h) => h !== hora));
      }
    }
  };

  /**
   * @description Guarda los bloqueos de una cancha
   */
  const handleGuardarBloqueos = async () => {
    if (!canchaSeleccionada) return;

    const nuevosBloqueos = bloqueadosTemp.filter(
      (h) => !bloqueadosOriginales.includes(h)
    );

    await bloquearMutation.mutateAsync({
      id: canchaSeleccionada.id,
      data: {
        fecha: fechaKey,
        horarios: nuevosBloqueos,
      },
    });

    await desbloquearMutation.mutateAsync({
      id: canchaSeleccionada.id,
      data: {
        fecha: fechaKey,
        horarios: desbloqueados,
      },
    });
    setModalVisible(false);
  };
  
  
  if (isLoading) return <TennisBallLoader />;
  
  if (!data) return CustomToast({type: "error", title: "Error", message: error?.message || "Error al obtener las canchas" });;
  
  
  return (
    <CustomSafeAreaView style={{ flex: 1, backgroundColor: "#b91c1c" }}>
      {/* Header */}
      <CustomHeader
        title="Administración"
        subtitle="Administra y habilita canchas"
        leftButton={
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/canchas/admin-canchas")}
          >
            <Settings2 size={22} color="white" />
          </TouchableOpacity>
        }
        rightButton={
          <TouchableOpacity onPress={() => signOut()}>
            <LogOut size={22} color="white" />
          </TouchableOpacity>
        }
        containerClassName="bg-red-700"
        backgroundColor="red"
      />

      <View className="flex-1 bg-gray-50">
        {/* Selector de fecha */}
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
              <Text className="text-lg font-SoraBold text-red-700 mt-1">
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
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
            onChange={(_, selectedDate) => {
              setMostrarDatePicker(false);
              if (selectedDate) setFecha(selectedDate);
            }}
          />
        )}

        {/* Lista de canchas */}
        <ScrollView className="p-4 flex-1">
          {data?.map((cancha: Cancha) => (
            <CanchaCard
              key={cancha.id}
              nombre={cancha.nombre}
              superficie="Polvo ladrillo"
              imageId={cancha.id}
              onPress={() => {
                setCanchaSeleccionada(cancha);
                const bloqueadosBackend =
                  cancha.disponibilidades?.[0]?.horariosBloqueados || [];
                setBloqueadosOriginales(bloqueadosBackend);
                setBloqueadosTemp(bloqueadosBackend);
                setDesbloqueados([]);
                setModalVisible(true);
              }}
            />
          ))}
        </ScrollView>

        {/* Modal de horarios */}
        {canchaSeleccionada && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View className="flex-1 bg-black/50 justify-center items-center">
              <View className="bg-white w-11/12 rounded-2xl p-8 max-h-[70%]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xl font-bold">
                    {canchaSeleccionada.nombre}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={22} color="black" />
                  </TouchableOpacity>
                </View>

                <View className="h-px bg-gray-200 w-full my-6" />

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
                  ].sort((a, b) => {
                    const toMinutes = (hora: string) => {
                      const [h, m] = hora.split(":").map(Number);
                      return h * 60 + m;
                    };
                    return toMinutes(a.hora) - toMinutes(b.hora);
                  })}
                  keyExtractor={(item) => item.hora}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 12,
                    gap: 4,
                  }}
                  renderItem={({ item }) => {
                    const { hora, estado } = item;
                    const ocupado = estado === "ocupado";
                    const bloqueado = bloqueadosTemp.includes(hora);

                    return (
                      <TouchableOpacity
                        disabled={ocupado}
                        onPress={() => toggleBloqueo(hora)}
                        className={`py-3 rounded-xl items-center w-[30%] border-2 ${
                          ocupado
                            ? "border-gray-400 bg-gray-200"
                            : bloqueado
                            ? "border-red-500 bg-red-50"
                            : "border-green-400 bg-white"
                        }`}
                      >
                        <Text
                          className={`text-sm font-bold ${
                            ocupado
                              ? "text-gray-600"
                              : bloqueado
                              ? "text-red-600"
                              : "text-gray-800"
                          }`}
                        >
                          {hora}
                        </Text>
                        <Text
                          className={`text-xs mt-0.5 ${
                            ocupado
                              ? "text-gray-500"
                              : bloqueado
                              ? "text-red-400"
                              : "text-green-500"
                          }`}
                        >
                          {ocupado
                            ? "Ocupado"
                            : bloqueado
                            ? "Bloqueado"
                            : "Disponible"}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />

                {/* Botones */}
                <View className="flex-row gap-3 justify-between mt-6">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-SoraMedium">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-red-600 py-3 rounded-xl items-center flex-row justify-center gap-2"
                    onPress={handleGuardarBloqueos}
                  >
                    <ShieldBan size={18} color="white" />
                    <Text className="text-white font-SoraBold">Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </CustomSafeAreaView>
  );
}
