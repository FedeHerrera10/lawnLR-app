import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/apiaxios";
import * as Linking from "expo-linking";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ArrowRight, CheckCircle, Plus } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type Player = {
  id: string;
  dni: string;
};

type Step = 'jugadores' | 'pago' | 'confirmacion';

export default function ReservaScreen() {
  const { data } = useLocalSearchParams();
  const { data: user } = useAuth();  // 👈 aquí tenemos el usuario logueado

  // Parseamos el string de vuelta a objeto
  //Ejemplo de data que pasa 
  //Reservas [{"canchaId": 1, "canchaNombre": "Cancha 1", "horarios": ["10:00"]}]
  const reservas = data ? JSON.parse(data as string) : [];

  console.log("Reservas", reservas);

  const [currentStep, setCurrentStep] = useState<Step>('jugadores');
  const [players, setPlayers] = useState<Player[]>([{ id: '1', dni: '' }]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsLoading(false);
        setCurrentStep('jugadores');
        setPlayers([{ id: '1', dni: '' }]);
      };
    }, [])
  );


  // const seleccionadosParsed: { cancha: string; hora: string; precio: number }[] =
  //   [];

  // const cancha = seleccionadosParsed[0]?.cancha ?? "N/A";
  // const horaInicio = seleccionadosParsed[0]?.hora ?? "-";
  // const horaFin =
  //   seleccionadosParsed.length > 1
  //     ? seleccionadosParsed[seleccionadosParsed.length - 1].hora
  //     : horaInicio;

  // const total = seleccionadosParsed.reduce((acc, s) => acc + (s.precio ?? 0), 0);
  // Obtenemos la reserva que viene desde la pantalla anterior
  const reserva = reservas[0];
  const cancha = reserva?.canchaNombre ?? "N/A";
  const fechaSeleccionada = reserva?.fecha ?? new Date().toISOString().split("T")[0];
  const horariosSeleccionados = reserva?.horarios ?? [];
  const horaInicio = horariosSeleccionados[0] ?? "-";
  const horaFin = horariosSeleccionados.length > 1 ? horariosSeleccionados[horariosSeleccionados.length - 1] : horaInicio;

  // 💵 Por ahora total hardcodeado, luego podrás calcularlo según tu lógica
  const total = 0.5;


  // Rest of the component will be in the next part

  const handleAddPlayer = () => {
    setPlayers([...players, { id: Date.now().toString(), dni: '' }]);
  };

  const handlePlayerChange = (id: string, field: keyof Player, value: string) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, [field]: value } : player
    ));
  };

  const handleNextStep = () => {
    if (currentStep === 'jugadores') {
      if (players.some(p => p.dni.trim())) {
        setCurrentStep('pago');
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Por favor ingresa al menos un jugador",
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 14 },
        });
      }
    } else if (currentStep === 'pago') {
      if (cardNumber && cardExpiry && cardCvv) {
        setCurrentStep('confirmacion');
        processPayment();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Por favor completa todos los datos de pago",
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 14 },
        });
      }
    }
  };

  // // const processPayment = () => {
  // //   setIsLoading(true);
  // //   // Simular procesamiento de pago
  // //   setTimeout(() => {
  // //     setIsLoading(false);
  // //   }, 2000);
  // // };

  // // const processPayment = async () => {
  // //   try {
  // //     setIsLoading(true);

  // //     const reserva = reservas[0]; // suponiendo que solo reservás una cancha por vez
  // //     const body = {
  // //       usuarioId: user?.id,                // <- este es el id del usuario logueado
  // //       canchaId: reserva.canchaId,
  // //       fecha: new Date().toISOString().split("T")[0], // o la fecha que seleccionaste
  // //       horarios: reserva.horarios,
  // //       jugadores: players.map(p => ({ dni: p.dni })),
  // //       montoTotal: total
  // //     };

  // //     const { data } = await axios.post("api/reservas", body);

  // //     console.log("✅ Reserva creada:", data);
  // //     setIsLoading(false);
  // //     setCurrentStep("confirmacion");
  // //   } catch (error) {
  // //     console.error(error);
  // //     setIsLoading(false);
  // //     Toast.show({
  // //       type: "error",
  // //       text1: "Error",
  // //       text2: "No se pudo procesar la reserva",
  // //     });
  // //   }
  // // };

  // // const processPayment = async () => {
  // //   try {
  // //     setIsLoading(true);

  // //     const body = {
  // //       usuarioId: user?.id,
  // //       canchaId: reserva.canchaId,
  // //       fecha: fechaSeleccionada,
  // //       horarios: horariosSeleccionados,
  // //       jugadores: players.map(p => ({ dni: p.dni })),
  // //       montoTotal: total,
  // //       idPago: "123456789" // 👈 por ahora fijo, luego se reemplaza con MP
  // //     };

  // //     console.log("📤 JSON que se enviará:", body);

  // //     const { data } = await axios.post("/api/reservas", body);

  // //     console.log("✅ Reserva creada:", data);
  // //     setIsLoading(false);
  // //     setCurrentStep("confirmacion");
  // //   } catch (error) {
  // //     console.error(error);
  // //     setIsLoading(false);
  // //     Toast.show({
  // //       type: "error",
  // //       text1: "Error",
  // //       text2: "No se pudo procesar la reserva",
  // //     });
  // //   }
  // // };

  // const processPayment = async () => {
  //   try {
  //     setIsLoading(true);

  //     const body = {
  //       usuarioId: user?.id,
  //       canchaId: reserva.canchaId,
  //       fecha: fechaSeleccionada,
  //       horarios: horariosSeleccionados,
  //       jugadores: players.map(p => ({ dni: p.dni })),
  //       montoTotal: total
  //     };

  //     console.log("📤 JSON que se enviará:", body);

  //     const { data } = await axios.post("/api/pagos/crear", body);
  //     console.log("✅ Preferencia creada:", data);

  //     const mpUrl = data.init_point; // URL devuelta por tu backend
  //     Linking.openURL(mpUrl);        // Abre Mercado Pago Checkout

  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setIsLoading(false);
  //     Toast.show({
  //       type: "error",
  //       text1: "Error",
  //       text2: "No se pudo iniciar el pago con Mercado Pago",
  //     });
  //   }
  // };
  const processPayment = async () => {
    try {
      setIsLoading(true);
  
      const body = {
        descripcion: `Reserva ${cancha}`, // Título dinámico de la reserva
        monto: total                     // 💸 Total a pagar
      };
  
      // 👇 Llamada a tu backend usando la instancia axios que ya configuraste
      const { data } = await api.post("/api/pagos/crear", body);
  
      console.log("✅ Preferencia creada:", data);
  
      if (data.init_point) {
        // Abre el checkout de Mercado Pago en el navegador
        await Linking.openURL(data.init_point);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se recibió un enlace de pago de Mercado Pago",
        });
      }
    } catch (error) {
      console.error("❌ Error al crear preferencia de pago:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo iniciar el pago con Mercado Pago",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // const processPayment = async () => {
  //   try {
  //     setIsLoading(true);
  
  //     const reservaPayload = {
  //       usuarioId: user?.id,
  //       canchaId: reserva.canchaId,
  //       fecha: fechaSeleccionada,
  //       horarios: horariosSeleccionados,
  //       jugadores: players.map(p => ({ dni: p.dni })),
  //       montoTotal: total,
  //       idPago: "123456789" // luego podés guardar el preferenceId real si querés
  //     };
  
  //     // 👉 Guardamos para poder usarlo al volver del pago
  //     globalThis.lastReserva = reservaPayload;
  
  //     const { data } = await api.post("/api/pagos/crear", reservaPayload);
  //     console.log("✅ Preferencia creada:", data);
  
  //     Linking.openURL(data.init_point);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setIsLoading(false);
  //   }
  // };
  

  const handleFinish = () => {
    Toast.show({
      type: "success",
      text1: "Reserva confirmada",
      text2: `¡Tu reserva en ${cancha} ha sido confirmada!`,
      text1Style: { fontSize: 18 },
      text2Style: { fontSize: 14 },
    });
    router.push("/(tabs)");
  };

  const renderStepIndicator = () => (
    <View className="flex-row justify-between items-center mb-8 px-4">
      {['jugadores', 'pago', 'confirmacion'].map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted =
          (step === 'jugadores' && currentStep !== 'jugadores') ||
          (step === 'pago' && currentStep === 'confirmacion');

        return (
          <React.Fragment key={step}>
            <View className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${isActive || isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle size={20} color="white" />
                ) : (
                  <Text className={`font-SoraBold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text className={`mt-2 text-xs font-SoraMedium ${isActive || isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                {step === 'jugadores' ? 'Jugadores' :
                  step === 'pago' ? 'Pago' : 'Confirmación'}
              </Text>
            </View>
            {index < 2 && (
              <View className="flex-1 h-1 mx-2 bg-gray-200">
                <View
                  className={`h-full ${(currentStep === 'pago' && index === 0) ||
                    (currentStep === 'confirmacion' && index <= 1)
                    ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  style={{ width: '100%' }}
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
      case 'jugadores':
        return (
          <View className="space-y-4">
            <Text className="text-xl font-SoraBold text-gray-800 mb-4">Jugadores</Text>
            {players.map((player, index) => (
              <View key={player.id} className="bg-gray-50 p-4 rounded-lg">
                <Text className="text-gray-600 font-SoraMedium mb-2 text-lg">Jugador {index + 1}</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-3"
                  placeholder="DNI"
                  keyboardType="numeric"
                  value={player.dni}
                  onChangeText={(text) => handlePlayerChange(player.id, 'dni', text)}
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={handleAddPlayer}
              className="mt-4 rounded-xl py-4 border-dashed  border border-green-600 flex-row gap-2 justify-center items-center"
            >

              <Text className="text-green-600 font-SoraExtraBold text-lg">Agregar otro jugador</Text>
              <Plus size={20} color="green" strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextStep}
              className="mt-4 bg-green-700 rounded-xl py-4  shadow-md flex-row gap-2 justify-center items-center"
            >
              <Text className="text-white font-SoraExtraBold text-lg">Continuar</Text>
              <ArrowRight size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>

          </View>
        );

      case 'pago':

        return (
          <View className="space-y-6">
            <Text className="text-xl font-SoraBold text-gray-800">Resumen de pago</Text>

            {/* Detalles de la reserva */}
            {/* <View className="bg-white rounded-xl p-4 border border-gray-200 mt-2">
                <Text className="text-lg font-SoraBold text-emerald-800 mb-3">{cancha}</Text>
                
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 font-SoraMedium">Fecha:</Text>
                    <Text className="font-SoraMedium">{""}</Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600 font-SoraMedium">Horario:</Text>
                    <Text className="font-SoraMedium">
                      {horaInicio} - {horaFin}
                    </Text>
                  </View>
                </View>
              </View> */}
            <View className="bg-white rounded-xl p-4 border border-gray-200 mt-2">
              <Text className="text-lg font-SoraBold text-emerald-800 mb-3">{cancha}</Text>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 font-SoraMedium">Fecha:</Text>
                  <Text className="font-SoraMedium">
                    {new Date(fechaSeleccionada).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600 font-SoraMedium">Horario:</Text>
                  <Text className="font-SoraMedium">
                    {horaInicio}{horaFin !== horaInicio ? ` - ${horaFin}` : ""}
                  </Text>
                </View>
              </View>
            </View>


            {/* Desglose de pagos */}
            <View className="bg-white rounded-xl p-4 border border-gray-200 mt-4">
              <Text className="text-lg font-SoraBold text-gray-800 mb-3">Detalle de pagos</Text>

              <View className="space-y-3">
                {players.map((player, index) => (
                  <View key={player.id} className="flex-row justify-between">
                    <View>
                      <Text className="text-gray-600 font-SoraMedium">Jugador {index + 1}</Text>
                      {player.dni ? (
                        <Text className="text-sm font-SoraMedium text-gray-500 mt-2">DNI: {player.dni}</Text>
                      ) : null}
                    </View>
                    <Text className="font-SoraMedium my-2 ">${total.toFixed(2)}</Text>
                  </View>
                ))}

                <View className="border-t border-gray-200 my-2"></View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600 my-2 font-SoraMedium">Subtotal ({players.length} {players.length === 1 ? 'jugador' : 'jugadores'}):</Text>
                  <Text className="font-SoraMedium">${total.toFixed(2)}</Text>
                </View>

                <View className="border-t-2 border-gray-300 my-2"></View>

                <View className="flex-row justify-between">
                  <Text className="text-lg font-SoraBold my-2">Total a pagar:</Text>
                  <Text className="text-lg font-SoraBold text-green-600">${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Botón de pago (simulado) */}
            {/* <View className="mt-4">
              <TouchableOpacity
                onPress={() => {
                  // Simulamos el proceso de pago
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    setCurrentStep('confirmacion');
                  }, 1500);
                }}
                className="bg-blue-600 py-4 rounded-xl items-center"
                disabled={isLoading}
              >
                <Text className="text-white font-SoraBold text-lg">
                  {isLoading ? 'Procesando pago...' : 'Pagar ahora'}
                </Text>
              </TouchableOpacity>

              <Text className="text-center text-gray-500 text-xs mt-2">
                Al continuar, aceptas nuestros Términos de servicio y Política de privacidad
              </Text>
            </View> */}
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
        );


      case 'confirmacion':
        return (
          <View className="items-center py-8">
            <View className="bg-green-100 p-6 rounded-full mb-6">
              <CheckCircle size={60} color="#059669" />
            </View>
            <Text className="text-2xl font-SoraBold text-gray-800 mb-2 text-center">
              ¡Pago exitoso!
            </Text>
            <Text className="text-gray-600 text-center mb-8">
              Tu reserva ha sido confirmada y el pago ha sido procesado exitosamente.
            </Text>

            <View className="w-full bg-gray-50 p-4 rounded-lg mb-6">
              <Text className="text-lg font-SoraBold text-emerald-800 mb-3">Detalles de la reserva</Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Cancha:</Text>
                  <Text className="font-SoraMedium">{cancha}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Fecha:</Text>
                  <Text className="font-SoraMedium">{ }</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Horario:</Text>
                  <Text className="font-SoraMedium">
                    {horaInicio}{horaFin !== horaInicio ? ` - ${horaFin}` : ''}
                  </Text>
                </View>
                <View className="border-t border-gray-200 my-2"></View>
                <View className="flex-row justify-between">
                  <Text className="text-lg font-SoraBold">Total pagado:</Text>
                  <Text className="text-lg font-SoraBold text-green-600">${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <Text className="text-gray-500 text-center text-sm mb-6">
              Se ha enviado un comprobante a tu correo electrónico.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-700" edges={["top"]}>
      {/* Header */}
      <View className="bg-green-700 px-6 py-4 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <View className="flex-row items-center justify-between px-2">
          {/* Flecha izquierda */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              currentStep === "jugadores"
                ? router.back()
                : setCurrentStep("jugadores")
            }
            className="p-1 w-8 items-start" // ancho fijo
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>

          {/* Texto centrado */}
          <Text className="text-white text-2xl font-SoraExtraBold text-center flex-1">
            {currentStep === "jugadores"
              ? "Jugadores"
              : currentStep === "pago"
                ? "Pago"
                : "Confirmación"}
          </Text>

          {/* Espaciador derecho para centrar el texto */}
          <View className="w-8" />
        </View>

      </View>



      <ScrollView className="flex-1 px-4 py-6 bg-gray-100">
        {/* Indicador de pasos */}
        {renderStepIndicator()}

        {/* Contenido del paso actual */}
        <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {renderStepContent()}
        </View>
      </ScrollView>


    </SafeAreaView>
  );
};