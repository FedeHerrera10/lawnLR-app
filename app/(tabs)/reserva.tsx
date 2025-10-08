import CustomToast from "@/components/ui/CustomToast";
import CustomHeader from "@/components/ui/layout/CustomHeader";
import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
import { Jugador, jugadoresSchema, Step } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/apiaxios";
import { obtenerResumen } from "@/lib/apis/Reserva";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Plus,
  SquareUser,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReservaScreen() {
  const { data } = useLocalSearchParams();
  const { data: user } = useAuth();

  const reservas = data ? JSON.parse(data as string) : [];

  const [currentStep, setCurrentStep] = useState<Step>("jugadores");
  const [players, setPlayers] = useState<Jugador[]>([{ id: "1", dni: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumenDePago, setResumenPago] = useState<any>(null);

  const {
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jugadoresSchema),
    defaultValues: {
      jugadores: [{ dni: "" }],
    },
    mode: "onChange",
  });

  const jugadoresCargado = watch("jugadores");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jugadores",
  });

  const mutation = useMutation({
    mutationFn: obtenerResumen,
    onSuccess: (data) => {
      console.log(data);
      setResumenPago(data);
    },
    onError: (error) => {
      CustomToast({
        title: "Error",
        message: "No se pudo obtener el resumen de pago",
        type: "error",
      });
    },
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsLoading(false);
        setCurrentStep("jugadores");
        setPlayers([{ id: "1", dni: "" }]);
        reset();
      };
    }, [])
  );

  const reserva = reservas[0];
  const cancha = reserva?.canchaNombre ?? "N/A";
  const horariosSeleccionados = reserva?.horarios ?? [];

  const handleAddPlayer = () => {
    setPlayers([...players, { id: Date.now().toString(), dni: "" }]);
  };

  const obtenerResumenDePago = async () => {
    const data = {
      jugadores: jugadoresCargado,
      cantidadHoras: horariosSeleccionados.length,
    };
    mutation.mutate(data);
  };

  const validarDniRepetidos  = () => {
    const dnis = jugadoresCargado.map((j) => j.dni);
    return new Set(dnis).size === dnis.length;
  }

  const handleNextStep = async () => {
    if (currentStep === "jugadores") {
      if (jugadoresCargado.some((p) => p.dni.trim())) {
        if (!validarDniRepetidos() ) {
          CustomToast({
            title: "Error",
            message: "Existen jugadores repetidos",
            type: "error",
          });
          return;
        }
        await obtenerResumenDePago();
        setCurrentStep("pago");
      } else {
        CustomToast({
          title: "Error",
          message: "Por favor ingresa al menos un jugador",
          type: "error",
        });
      }
    } else if (currentStep === "pago") {
      setCurrentStep("confirmacion");
      processPayment();
    }
  };

  const processPayment = async () => {
    try {
      setIsLoading(true);
      const body = {
        descripcion: `Reserva ${cancha}`,
        monto: resumenDePago?.totalGeneral ?? 0,
      };
      const { data } = await api.post("/api/pagos/crear", body);
      if (data.init_point) {
        await Linking.openURL(data.init_point);
      } else {
        CustomToast({
          title: "Error",
          message: "No se recibió un enlace de pago de Mercado Pago",
          type: "error",
        });
      }
    } catch (error) {
      console.error("❌ Error al crear preferencia de pago:", error);
      CustomToast({
        title: "Error",
        message: "No se pudo iniciar el pago con Mercado Pago",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "jugadores") {
      router.back();
    } else {
      setCurrentStep("jugadores");
    }
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-between items-center mb-8 px-4">
      {["jugadores", "pago", "confirmacion"].map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted =
          (step === "jugadores" && currentStep !== "jugadores") ||
          (step === "pago" && currentStep === "confirmacion");

        return (
          <React.Fragment key={step}>
            <View className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isActive || isCompleted ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={20} color="white" />
                ) : (
                  <Text
                    className={`font-SoraBold ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                className={`mt-2 text-xs font-SoraMedium ${
                  isActive || isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {step === "jugadores"
                  ? "Jugadores"
                  : step === "pago"
                  ? "Pago"
                  : "Confirmación"}
              </Text>
            </View>
            {index < 2 && (
              <View className="flex-1 h-1 mx-2 bg-gray-200">
                <View
                  className={`h-full ${
                    (currentStep === "pago" && index === 0) ||
                    (currentStep === "confirmacion" && index <= 1)
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                  style={{ width: "100%" }}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "jugadores":
        return (
          <View className="space-y-4">
            <Text className="text-xl font-SoraBold text-gray-800 mb-4">
              Jugadores
            </Text>
            {players.map((player, index) => (
              <View key={player.id} className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-gray-600 font-SoraMedium mb-2 text-lg">
                  Jugador {index + 1}
                </Text>
                <Controller
                  control={control}
                  name={`jugadores.${index}.dni`}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      className={`border ${
                        errors.jugadores?.[index]?.dni
                          ? "border-red-600"
                          : "border-gray-300"
                      } rounded-2xl px-4 py-2 mb-2 bg-white flex-row items-center`}
                    >
                      <SquareUser size={20} color="#15803d" />
                      <TextInput
                        className="flex-1 px-3 py-2.5 text-lg tracking-tight text-gray-900 font-Sora"
                        placeholderTextColor="#6b7280"
                        placeholder="Ingresa el DNI del jugador"
                        keyboardType="numeric"
                        value={value ? String(value) : ""}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </View>
                  )}
                />
                {errors.jugadores?.[index]?.dni && (
                  <Text className="text-red-500 mt-1">
                    {errors.jugadores[index]?.dni?.message as string}
                  </Text>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={handleAddPlayer}
              className="mt-4 rounded-xl py-4 border-dashed border border-green-600 flex-row gap-2 justify-center items-center"
            >
              <Text className="text-green-600 font-SoraExtraBold text-lg">
                Agregar otro jugador
              </Text>
              <Plus size={20} color="green" strokeWidth={2} />
            </TouchableOpacity>

            {players.length > 0 && (
              <TouchableOpacity
                onPress={handleNextStep}
                className="mt-4 bg-green-700 rounded-xl py-4 shadow-md flex-row gap-2 justify-center items-center"
              >
                <Text className="text-white font-SoraExtraBold text-lg">
                  Continuar
                </Text>
                <ArrowRight size={20} color="white" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
        );

      case "pago":
        return mutation.isPending ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-600 font-SoraMedium">Cargando...</Text>
          </View>
        ) : resumenDePago ? (
          <View className="space-y-6">
            <View className="bg-white rounded-xl p-4 border border-gray-200 mt-4">
              <Text className="text-lg font-SoraBold text-gray-800 mb-3">
                Detalle de pagos
              </Text>

              <View className="space-y-3">
                {resumenDePago?.preciosPorJugador.map((player, index) => (
                  <View key={index} className="flex-row justify-between">
                    <View>
                      <Text className="text-gray-600 font-SoraMedium">
                        Jugador {index + 1}
                      </Text>
                      {player.dni ? (
                        <View>
                          <Text className="text-sm font-SoraMedium text-gray-500 mt-2">
                            DNI: {player.dni}
                          </Text>

                          <Text className="text-sm font-SoraMedium text-gray-500 mt-2">
                            Precio Por Hora: ${player.precioPorHora.toFixed(2)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text className="font-SoraMedium my-2 ">
                      ${player.total.toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View className="border-t border-gray-200 my-2"></View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600 my-2 font-SoraMedium">
                    Subtotal ({players.length}{" "}
                    {players.length === 1 ? "jugador" : "jugadores"}):
                  </Text>
                  <Text className="font-SoraMedium">
                    ${resumenDePago.totalGeneral.toFixed(2)}
                  </Text>
                </View>

                <View className="border-t-2 border-gray-300 my-2"></View>

                <View className="flex-row justify-between">
                  <Text className="text-lg font-SoraBold my-2">
                    Total a pagar:
                  </Text>
                  <Text className="text-lg font-SoraBold text-green-600">
                    ${resumenDePago?.totalGeneral.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={processPayment}
              className="bg-blue-600 py-4 rounded-xl items-center"
              disabled={isLoading}
            >
              <Text className="text-white font-SoraBold text-lg">
                {isLoading ? "Procesando pago..." : "Pagar ahora"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text className="text-gray-500 font-SoraMedium">
            Esperando resumen de pago...
          </Text>
        );

      case "confirmacion":
        return (
          <View className="items-center py-8">
            <View className="bg-green-100 p-6 rounded-full mb-6">
              <CheckCircle size={60} color="#059669" />
            </View>
            <Text className="text-2xl font-SoraBold text-gray-800 mb-2 text-center">
              ¡Pago exitoso!
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Tu reserva ha sido confirmada y el pago ha sido procesado
              exitosamente.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <CustomSafeAreaView style={{ flex: 1, backgroundColor: "#15803d" }}>
      <CustomHeader
        title={
          currentStep === "jugadores"
            ? "Jugadores"
            : currentStep === "pago"
            ? "Pago"
            : "Confirmación"
        }
        subtitle="Completa la reserva"
        backgroundColor="green"
        containerClassName="bg-green-700"
        leftButton={
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBack}
            className="p-1 w-8 items-start"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
        }
      />

      <ScrollView className="flex-1 px-4 py-6 bg-gray-100">
        {renderStepIndicator()}
        <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {renderStepContent()}
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
