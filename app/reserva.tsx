import { router, useLocalSearchParams } from "expo-router";
import { Wallet, XIcon } from "lucide-react-native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

export default function ReservaScreen() {
  const { fecha, seleccionados } = useLocalSearchParams<{
    fecha: string;
    seleccionados: string;
  }>();

  const seleccionadosParsed: { cancha: string; hora: string; precio: number }[] =
    seleccionados ? JSON.parse(seleccionados) : [];

  const cancha = seleccionadosParsed[0]?.cancha ?? "N/A";
  const horaInicio = seleccionadosParsed[0]?.hora ?? "-";
  const horaFin =
    seleccionadosParsed.length > 1
      ? seleccionadosParsed[seleccionadosParsed.length - 1].hora
      : horaInicio;

  const total = seleccionadosParsed.reduce((acc, s) => acc + (s.precio ?? 0), 0);

  const handlePagar = () => {
    
    Toast.show({
      type: "success",
      text1: "Reserva confirmada",
      text2: `Entra a reserva para ver tu reserva`,
      text1Style: { fontSize: 18 },
          text2Style: { fontSize: 14 },

    });
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="p-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-green-700 rounded-2xl p-6 mb-8 shadow-lg mt-10">
          <Text className="text-3xl font-extrabold mt-3 text-white mb-2">
            🎾 Confirmar Reserva
          </Text>
          <Text className="text-green-100 text-base">
            Revisa los datos antes de pagar
          </Text>
        </View>

        {/* Card de información */}
          
        {/* Resumen de pago */}
        <View className=" bg-white rounded-2xl shadow-lg p-6 mb-6 ">
        <Text className="text-2xl font-bold text-emerald-800 mb-6 text-center">
          🎾 {cancha}
          </Text>
          <View className="flex-col justify-between mb-3 text-xl">
          <Text className="text-xl font-bold text-emerald-800  text-center">
       Reservado por
        </Text>
        <Text className="text-lg font-bold text-emerald-800 mb-6 text-center">
        Federico Herrera - 37.319.074 
        </Text>
        </View>
          
          <Text className="text-xl font-bold text-gray-800 mb-4">Resumen de pago</Text>
          
          <View className="space-y-4">
            {/* Fecha */}
            <View className="flex-row justify-between mb-3 text-xl">
              <Text className="text-gray-600 font-semibold text-xl">📅 Fecha</Text>
              <Text className="font-medium text-xl text-gray-800">{fecha}</Text>
            </View>
            
            {/* Hora */}
            <View className="flex-row justify-between mb-3 text-xl">
              <Text className="text-gray-600 font-semibold text-xl">⏱  Hora</Text>
              <Text className="font-medium text-xl text-gray-800">
                {horaInicio}{horaFin !== horaInicio ? ` - ${horaFin}` : ''}
              </Text>
            </View>
            
            {/* Precio por turno */}
            <View className="flex-row justify-between  mb-3 text-xl">
              <Text className="text-gray-600 font-semibold text-xl">💰Precio por turno</Text>
              <Text className="font-medium text-xl text-gray-800">
                ${seleccionadosParsed[0]?.precio ?? 0}
              </Text>
            </View>
            
            {/* Línea divisoria */}
            <View className="h-px bg-gray-200 my-2"></View>
            
            {/* Total a pagar */}
            <View className="flex-row justify-between pt-2 text-xl">
              <Text className="text-xl font-bold text-gray-800">💰 Total a pagar</Text>
              <Text className="text-2xl font-bold text-green-600">${total}</Text>
            </View>
          </View>
        </View>

        {/* Botón Pagar */}
        <TouchableOpacity
          onPress={handlePagar}
          activeOpacity={0.9}
          className="bg-green-700 py-5 rounded-2xl items-center shadow-lg mb-4 flex-row justify-center gap-2"
        >
          <Text className="text-white text-2xl font-semibold tracking-wide">
            Pagar ahora
          </Text>
          <Wallet className="w-5 h-5 t  ext-white text-semibold" color="white" strokeWidth={2} />
        </TouchableOpacity>

        {/* Botón Cancelar */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="bg-red-700 py-5 rounded-2xl items-center shadow-lg mb-4 flex-row justify-center gap-2"
        >
          <Text className="text-white text-2xl font-semibold tracking-wide">  
            Cancelar reserva
          </Text>
          <XIcon className="w-5 h-5 text-white " color="white" strokeWidth={3} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}