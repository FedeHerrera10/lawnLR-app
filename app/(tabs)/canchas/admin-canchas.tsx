import { FlatListCanchas } from "@/components/ui/FlatListCanchas";
import TennisBallLoader from "@/components/ui/Loader";

import {
  Cancha,
  HabilitarCanchaForm,
  habilitarCanchaSchema,
  HorarioProfesor,
} from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import {
  getCanchas,
  getDisponibilidades,
  habilitarCancha,
} from "@/lib/apis/Canchas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { ArrowLeft, Check, ChevronDown, LogOut, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import CustomToast from "@/components/ui/CustomToast";
import HorarioProfesorComponent from "@/components/ui/HorarioProfesorComponent";
import CustomHeader from "@/components/ui/layout/CustomHeader";
import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
import { getMonthRange } from "@/utils/DateUtil";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AdminCanchas() {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [showCanchaModal, setShowCanchaModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [firstDay, setFirstDay] = useState<string>("");
  const [lastDay, setLastDay] = useState<string>("");
  const [horariosProfesores, setHorariosProfesores] = useState<
    HorarioProfesor[]
  >([]);

  // -------------------- Queries --------------------
  const {
    data: canchas,
    error: errorCanchas,
    isLoading: isLoadingCanchas,
  } = useQuery({
    queryKey: ["canchas"],
    queryFn: () => getCanchas(),
  });

  const { data: disponibilidades, isLoading: isLoadingDisponibilidades } =
    useQuery({
      queryKey: ["disponibilidades", selectedCancha?.id, firstDay, lastDay],
      queryFn: () =>
        getDisponibilidades({
          id: selectedCancha?.id || 0,
          dateInicio: firstDay,
          dateFin: lastDay,
        }),
      enabled: !!selectedCancha && !!firstDay && !!lastDay,
    });

  const { handleSubmit } = useForm<HabilitarCanchaForm>({
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

  // -------------------- Focus Effect --------------------
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedCancha(null);
        setSelectedMonth(null);
        setHorariosProfesores([]);
        setShowCanchaModal(false);
        setShowMonthModal(false);
        setFirstDay("");
        setLastDay("");
      };
    }, [])
  );

  // -------------------- Handle Month Selection --------------------
  const handleMonthSelect = (month: number) => {
    const today = new Date();
    const newDate = new Date(today.getFullYear(), month, 1);
    setSelectedMonth(newDate);
    setShowMonthModal(false);

    const { firstDay: fd, lastDay: ld } = getMonthRange(
      newDate.getFullYear(),
      month + 1
    );
    setFirstDay(fd);
    setLastDay(ld);

    if (selectedCancha) {
      //refetch(); // siempre con los valores correctos ya en state
    }
  };

  // -------------------- Handle Cancha Change --------------------
  const handleChangeCancha = (cancha: Cancha) => {
    setSelectedCancha(cancha);

    // Si ya hay mes seleccionado, hacemos refetch directo
    if (selectedMonth) {
      const { firstDay: fd, lastDay: ld } = getMonthRange(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1
      );
      setFirstDay(fd);
      setLastDay(ld);
      //refetch();
    }
    setShowCanchaModal(false);
  };

  // -------------------- Mutation --------------------
  const mutation = useMutation({
    mutationFn: habilitarCancha,
    onSuccess: () => {
      CustomToast({
        type: "success",
        title: "Cancha habilitada correctamente",
        message: "",
      });
      setSelectedCancha(null);
      setSelectedMonth(null);
      setHorariosProfesores([]);
      queryClient.invalidateQueries({ queryKey: ["canchasxfecha"] });
      router.back();
    },
    onError: (error) => {
      CustomToast({
        type: "error",
        title: "Error",
        message: "Error al habilitar cancha",
      });
    },
  });

  // -------------------- Submit --------------------
  const onSubmit = (values: HabilitarCanchaForm) => {
    if (!selectedCancha || !selectedMonth) {
      return CustomToast({
        type: "error",
        title: "Error",
        message: "Debe seleccionar cancha y mes",
      });
    }

    const { firstDay: fd, lastDay: ld } = getMonthRange(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1
    );

    const payload = {
      canchaId: selectedCancha.id,
      fechaInicio: fd,
      fechaFin: ld,
      horaInicio: "08:00",
      horaFin: "22:00",
      horariosProfesores,
    };

    if (horariosProfesores.length === 0) {
      Alert.alert(
        "Confirmación",
        "¿Desea habilitar la cancha sin horarios de profesores?",
        [
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {},
          },
          {
            text: "Aceptar",
            onPress: () => {
              mutation.mutate(payload);
              return;
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      mutation.mutate(payload);
    }
  };

  if (isLoadingCanchas || isLoadingDisponibilidades)
    return <TennisBallLoader />;

  if (errorCanchas)
    return CustomToast({
      type: "error",
      title: "Error",
      message: "Error al cargar canchas",
    });

  return (
    <CustomSafeAreaView style={{ flex: 1, backgroundColor: "#b91c1c" }}>
      {/* Header */}
      <CustomHeader
        title="Habilitacion de canchas"
        subtitle="Seleccione la cancha y el mes"
        leftButton={
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/administracion")}
          >
            <ArrowLeft size={22} color="white" />
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

      <ScrollView className="flex-1 p-4 bg-gray-100">
        {/* Selector Cancha */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2 text-base font-SoraBold">
            Seleccionar Cancha
          </Text>
          <TouchableOpacity
            className="border border-gray-300 bg-white p-4 rounded-xl flex-row justify-between items-center"
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
                ? selectedCancha.nombre
                : "Seleccione una cancha..."}
            </Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Selección Mes */}
        {selectedCancha && (
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
          </View>
        )}

        {/* Horario de Profesores */}
        {selectedMonth && disponibilidades && disponibilidades.length === 0 && (
          <HorarioProfesorComponent
            horariosProfesores={[]}
            setHorariosProfesores={setHorariosProfesores}
          />
        )}

        {/* Mensaje de disponibilidad */}
        {disponibilidades && disponibilidades.length > 0 && (
          <View className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <Text className="text-blue-800 text-center">
              Este mes ya está habilitado.
            </Text>
          </View>
        )}

        {/* Botón Habilitar */}
        {selectedCancha && selectedMonth && disponibilidades.length === 0 && (
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending || isLoadingDisponibilidades}
            className="mt-4 mb-10 bg-green-700 rounded-xl py-4 shadow-md flex-row gap-2 justify-center items-center"
          >
            <Text className="text-white font-SoraExtraBold text-lg">
              {mutation.isPending ? "Habilitando..." : "Habilitar"}
            </Text>
            <Check size={20} color="white" strokeWidth={2} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal Cancha */}
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
              data={canchas || []}
              selectedCancha={selectedCancha}
              setSelectedCancha={handleChangeCancha}
              setShowCanchaModal={setShowCanchaModal}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Mes */}
      <Modal
        visible={showMonthModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[60%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-SoraBold">Seleccionar Mes</Text>
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
                      {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
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
                <Text className="text-red-600 font-SoraMedium">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </CustomSafeAreaView>
  );
}
