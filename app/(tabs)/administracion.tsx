import CanchaCard from "@/components/ui/canchaCard";
import TennisBallLoader from "@/components/ui/Loader";
import { Cancha } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import { bloquearHorario, getCanchasByDate } from "@/lib/apis/Canchas";
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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Administracion() {
  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const { signOut } = useAuth();

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["canchasxfecha", fecha],
    queryFn: () => getCanchasByDate(fecha.toISOString().split("T")[0]),
    enabled: true,
    staleTime: 0,
  });

  const mutation = useMutation({
    mutationFn: bloquearHorario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canchasxfecha", fecha] });  
      Toast.show({
        type: "success",
        text1: "Bloqueos guardados correctamente",
        text1Style: { fontSize: 16 },
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        text1Style: { fontSize: 16 },
        text2Style: { fontSize: 14 },
      });
    },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<Cancha | null>(null);
  const [bloqueadosTemp, setBloqueadosTemp] = useState<string[]>([]);
  
  if (isLoading) return <TennisBallLoader />;
  if (!data) return <Text>Error: {error?.message}</Text>;

  const fechaKey = fecha.toISOString().split("T")[0];

  const toggleBloqueo = (hora: string) => {
    if (bloqueadosTemp.includes(hora)) {
      setBloqueadosTemp((prev) => prev.filter((h) => h !== hora));
    } else {
      setBloqueadosTemp((prev) => [...prev, hora]);
    }
  };

  const handleGuardarBloqueos = () => {
    if (!canchaSeleccionada) return;

    const dataToSend = {
      fecha: fechaKey,
      horarios: bloqueadosTemp,
    };

    mutation.mutate({
      id: canchaSeleccionada.id,
      data: dataToSend,
    });

    setModalVisible(false);
    
  };

  return (
    <SafeAreaView className="flex-1 bg-red-700" edges={["top"]}>
      {/* Header */}
      <View className="bg-red-700 px-6 py-4 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.push("/(tabs)/canchas/admin-canchas")}>
          <Settings2 size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-SoraBold">Administración</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <LogOut size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-gray-50">
        {/* Selector de fecha */}
        <View className="p-4">
          <TouchableOpacity
            onPress={() => setMostrarDatePicker(true)}
            activeOpacity={0.85}
            className="w-full bg-white rounded-2xl shadow-md px-6 py-4 flex-row items-center justify-between border border-red-200"
          >
            <View>
              <Text className="text-gray-500 text-sm font-SoraMedium">Seleccionar fecha</Text>
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
        <ScrollView className="p-4 flex-1 ">
          {data?.map((cancha: Cancha) => (
            <CanchaCard
              key={cancha.id}
              nombre={cancha.nombre}
              superficie="Polvo ladrillo"
              imageId={cancha.id}
              onPress={() => {
                setCanchaSeleccionada(cancha);
                setBloqueadosTemp(cancha.disponibilidades?.[0]?.horariosBloqueados || []);
                setModalVisible(true);
              }}
            />
          ))}
        </ScrollView>

        {/* Modal de horarios */}
        {canchaSeleccionada && (
          <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View className="flex-1 bg-black/50 justify-center items-center">
              <View className="bg-white w-11/12 rounded-2xl p-8 max-h-[70%]">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xl font-bold">{canchaSeleccionada.nombre}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={22} color="black" />
                  </TouchableOpacity>
                </View>
                <View className="h-px bg-gray-200 w-full my-6" />

                 <FlatList
                    data={[
                      ...(canchaSeleccionada.disponibilidades?.[0]?.horariosDisponibles || []).map(
                        (h: string) => ({ hora: h, estado: "disponible" })
                      ),
                      ...(canchaSeleccionada.disponibilidades?.[0]?.horariosBloqueados || []).map(
                        (h: string) => ({ hora: h, estado: "bloqueado" })
                      ),
                      ...(canchaSeleccionada.disponibilidades?.[0]?.horariosOcupados || []).map(
                        (h: string) => ({ hora: h, estado: "ocupado" })
                      ),
                    ].sort((a, b) => {
                      // convertir "HH:mm" a minutos
                      const toMinutes = (hora: string) => {
                        const [h, m] = hora.split(":").map(Number);
                        return h * 60 + m;
                      };
                    
                      return toMinutes(a.hora) - toMinutes(b.hora);
                  
                    })
                  }
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
                    const bloqueado =
                      estado === "bloqueado" || bloqueadosTemp.includes(hora);

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

                <View className="flex-row gap-3 justify-between mt-6">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-SoraMedium">Cancelar</Text>
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
    </SafeAreaView>
  );
}
