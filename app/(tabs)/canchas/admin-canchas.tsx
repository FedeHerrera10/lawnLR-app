import { FlatListCanchas } from "@/components/ui/FlatListCanchas";
import TennisBallLoader from "@/components/ui/Loader";

import {
  Cancha,
  HabilitarCanchaForm,
  habilitarCanchaSchema,
  HorarioProfesor,
} from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import { getCanchas, habilitarCancha } from "@/lib/apis/Canchas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  LogOut,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { HorarioProfesorComponent } from "@/components/ui/horarioProfesor";
import { getMonthRange } from "@/utils/DateUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

// --------------------
// Helpers
// --------------------

// const mapDia = (dia: DiaSemana) => {
//   const map: Record<DiaSemana, string> = {
//     Lunes: "MONDAY",
//     Martes: "TUESDAY",
//     Miércoles: "WEDNESDAY",
//     Jueves: "THURSDAY",
//     Viernes: "FRIDAY",
//     Sábado: "SATURDAY",
//     Domingo: "SUNDAY",
//   };
//   return map[dia];
// };

// --------------------
// Main Component
// --------------------
export default function AdminCanchas() {
  const { signOut } = useAuth();
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);

  const [showCanchaModal, setShowCanchaModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [showMonthModal, setShowMonthModal] = useState(false);

  // Add this function to handle month selection
  const handleMonthSelect = (month: number) => {
    const newDate = new Date();
    newDate.setMonth(month);
    setSelectedMonth(newDate);
    setShowMonthModal(false);
  };
  const [horariosProfesores, setHorariosProfesores] = useState<
    HorarioProfesor[]
  >([]);
  const queryClient = useQueryClient();
  // ...
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HabilitarCanchaForm>({
    resolver: zodResolver(habilitarCanchaSchema),
    defaultValues: {
      canchaId: 1,
      fechaFin: "",
      fechaInicio: "",
      horaInicio: "08:00",
      horaFin: "23:00",
      horariosProfesores: [],
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // --------------------
  // Mutation
  // --------------------
  const mutation = useMutation({
    mutationFn: habilitarCancha,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Cancha habilitada correctamente ✅",
        text1Style: { fontSize: 16 },
      });
      queryClient.invalidateQueries({ queryKey: ["canchasxfecha"] });
      router.back();
    },
    onError: (error) => {
      console.error("Error al habilitar cancha:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error al habilitar cancha",
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 14 },
      });
    },
  });

  // --------------------
  // Queries
  // --------------------
  const { data, error, isLoading } = useQuery({
    queryKey: ["canchas"],
    queryFn: () => getCanchas(),
  });

  if (isLoading) return <TennisBallLoader />;
  if (error) return <Text>Error al cargar canchas</Text>;

  // --------------------
  // Submit
  // --------------------
  const onSubmit = (values: HabilitarCanchaForm) => {
    // Alert.alert("Cancha habilitada correctamente ✅");
    if (!selectedCancha) return;
    if (!selectedMonth)
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debe seleccionar un mes",
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 14 },
      });

    const { firstDay, lastDay } = getMonthRange(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1
    );

    const payload = {
      canchaId: selectedCancha.id,
      fechaInicio: firstDay,
      fechaFin: lastDay,
      horaInicio: "08:00",
      horaFin: "22:00",
      horariosProfesores: [],
    };


    mutation.mutate(payload);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 font-Sora">
      {/* Header */}
      <View className="bg-red-700 px-6 py-8 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()}>
          <ArrowLeft size={22} color="white" style={{ marginTop: 32 }} />
        </TouchableOpacity>
        <Text className="text-white mt-10 text-2xl font-bold text-center font-Sora">
          Habilitación de Canchas
        </Text>
        <TouchableOpacity onPress={signOut}>
          <LogOut size={22} color="white" style={{ marginTop: 32 }} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Selector de Cancha */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2 text-base font-SoraBold">
            Seleccionar Cancha
          </Text>
          <TouchableOpacity
            className="border border-gray-300 bg-white p-4 rounded-xl flex-row justify-between items-center "
            onPress={() => setShowCanchaModal(true)}
          >
            <Text
              className={`${
                selectedCancha
                  ? "text-gray-900 font-SoraMedium"
                  : "text-gray-400 font-SoraMedium"
              }`}
            >
              {selectedCancha
                ? `${selectedCancha.nombre} `
                : "Seleccione una cancha..."}
            </Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
          {selectedCancha && (
            <TouchableOpacity
              className="absolute right-10 top-10 p-2"
              onPress={() => setSelectedCancha(null)}
            >
              <X size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        {selectedCancha && (
          <>
            <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
              <View className="flex-row  items-center mb-3">
                <Text className="text-gray-700 font-SoraBold text-base mr-2">
                  Horario de Habilitación{" "}
                </Text>
                <Clock size={16} color="#6B7280" />
              </View>

              <View className="flex-row justify-between">
                <Controller
                  control={control}
                  name="horaInicio"
                  render={({ field: { value } }) => (
                    <View className="w-[48%]">
                      <Text className="text-gray-600 mb-1 font-SoraMedium">
                        Hora inicio
                      </Text>
                      <Text>{value}</Text>
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="horaFin"
                  render={({ field: { value } }) => (
                    <View className="w-[48%]">
                      <Text className="text-gray-600 mb-1 font-SoraMedium">
                        Hora fin
                      </Text>
                      <Text>{value}</Text>
                    </View>
                  )}
                />
              </View>
            </View>

            <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
              <Text className="text-gray-700 font-SoraBold text-base mb-3">
                Mes de Habilitación
              </Text>
              <TouchableOpacity
                className="border border-gray-200 p-3 rounded-lg"
                onPress={() => setShowMonthModal(true)}
              >
                <Text className="text-gray-700">
                  {selectedMonth
                    ? new Intl.DateTimeFormat("es-AR", {
                        month: "long",
                        year: "numeric",
                      }).format(selectedMonth)
                    : "Seleccionar mes"}
                </Text>
              </TouchableOpacity>
              <Text className="text-red-500 text-sm font-SoraSemiBold">
                {errors.fechaInicio?.message}
              </Text>
            </View>

            <Modal
              visible={showMonthModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowMonthModal(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6 max-h-[60%]">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-SoraBold">
                      Seleccionar Mes
                    </Text>
                    <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                      <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView className="mb-4">
                    {Array.from({ length: 12 }).map((_, index) => {
                      const date = new Date();
                      date.setMonth(index);
                      const monthName = new Intl.DateTimeFormat("es-AR", {
                        month: "long",
                      }).format(date);
                      const isSelected = selectedMonth?.getMonth() === index;

                      return (
                        <TouchableOpacity
                          key={index}
                          className="py-3 border-b border-gray-100 flex-row items-center"
                          onPress={() => handleMonthSelect(index)}
                        >
                          <View
                            className={`w-5 h-5 rounded-full border-2 ${
                              isSelected ? "border-red-600" : "border-gray-300"
                            } mr-3 justify-center items-center`}
                          >
                            {isSelected && (
                              <View className="w-3 h-3 bg-red-600 rounded-full" />
                            )}
                          </View>
                          <Text
                            className={`text-base ${
                              isSelected
                                ? "font-SoraBold text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {monthName.charAt(0).toUpperCase() +
                              monthName.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  <View className="flex-row justify-end space-x-3 pt-2 border-t border-gray-100">
                    <TouchableOpacity
                      className="px-4 py-2 rounded-lg"
                      onPress={() => setShowMonthModal(false)}
                    >
                      <Text className="text-red-600 font-SoraMedium">
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <HorarioProfesorComponent
              horariosProfesores={horariosProfesores}
              setHorariosProfesores={setHorariosProfesores}
            />
          </>
        )}

        {/* Botón de confirmación */}
        {selectedCancha && (
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="mt-4 mb-10 bg-green-700 rounded-xl py-4  shadow-md flex-row gap-2 justify-center items-center"
          >
            <Text className="text-white font-SoraExtraBold text-lg">
              {mutation.isPending ? "Actualizando..." : "Actualizar"}
            </Text>
            <Check size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal de selección de cancha */}
      <Modal
        visible={showCanchaModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCanchaModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={() => setShowCanchaModal(false)}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>

          <View className="bg-white rounded-t-3xl max-h-[80%] overflow-hidden">
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-SoraBold text-gray-900">
                Seleccionar Cancha
              </Text>
              <TouchableOpacity onPress={() => setShowCanchaModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatListCanchas
              data={data || []}
              selectedCancha={selectedCancha}
              setSelectedCancha={setSelectedCancha}
              setShowCanchaModal={setShowCanchaModal}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
