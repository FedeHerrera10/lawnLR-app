import CanchaCard from "@/components/ui/canchaCard";
import TennisBallLoader from "@/components/ui/Loader";
import { Cancha } from "@/constants/types";
import { useAuth } from "@/hooks/useAuth";
import { getCanchasByDate } from "@/lib/apis/Canchas";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { LogOut, Settings2, ShieldBan, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    if (data && !isLoading) setBloqueados(data);
  }, [data, isLoading]);

  // Estado del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<Cancha | null>(
    null
  );

  if (isLoading) return <TennisBallLoader />;
  if (!data) return <Text>Error: {error?.message}</Text>;

  const fechaKey = fecha.toISOString().split("T")[0];

  const toggleBloqueo = (cancha: string, hora: string) => {
    const actuales = bloqueados[fechaKey] || [];
    const ya = actuales.find((s) => s.cancha === cancha && s.hora === hora);
    if (ya) {
      // desbloquear
      setBloqueados({
        ...bloqueados,
        [fechaKey]: actuales.filter(
          (s) => !(s.cancha === cancha && s.hora === hora)
        ),
      });
    } else {
      // bloquear
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

  const aceptarBloqueos = () => {
    Toast.show({
      type: "success",
      text1: "Actualizado correctamente",
      text1Style: { fontSize: 16 },
    });
    setModalVisible(false);
  };

  const cancelarBloqueos = () => {
    // Restore the original blocked slots when canceling
    if (data) {
      setBloqueados(data);
    }
    setCanchaSeleccionada(null);
    setModalVisible(false);
  };

  const handleGuardarBloqueos = () => {
    Alert.alert("Guardar bloqueos", "¿Estás seguro de guardar los bloqueos?", [
      { text: "Cancelar", onPress: () => cancelarBloqueos() },
      {
        text: "Guardar",
        onPress: () => {
          aceptarBloqueos();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-red-700" edges={["top"]}>
      {/* Header */}
      <View className="bg-red-700 px-6 py-4 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/canchas/admin-canchas")}
        >
          <Settings2 size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-SoraBold">
          Administración de Canchas
        </Text>
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
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 bg-black/50 justify-center items-center">
              <View className="bg-white w-11/12 rounded-2xl p-8 max-h-[70%]">
                <View className="flex-row items-center justify-between ">
                  <Text className="text-xl font-bold">
                    {canchaSeleccionada.nombre}
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={22} color="black" />
                  </TouchableOpacity>
                </View>
                <View className="h-px bg-gray-200 w-full my-6" />

                <FlatList
                  data={
                    canchaSeleccionada.disponibilidades?.[0]
                      ?.horariosDisponibles || []
                  }
                  keyExtractor={(item) => item}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 12,
                    gap: 4,
                  }}
                  contentContainerStyle={{
                    paddingBottom: 16,
                    paddingTop: 8,
                  }}
                  renderItem={({ item }) => {
                    const bloqueado = isBloqueado(
                      canchaSeleccionada.nombre,
                      item
                    );
                    return (
                      <TouchableOpacity
                        className={`py-3 rounded-xl items-center w-[30%] border-2 ${
                          bloqueado
                            ? "border-red-500 bg-red-50"
                            : "border-green-400 bg-white"
                        }`}
                        style={{
                          shadowColor: bloqueado ? "#ef4444" : "#4ade80",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.15,
                          shadowRadius: 3.84,
                          elevation: 3,
                        }}
                        onPress={() =>
                          toggleBloqueo(canchaSeleccionada.nombre, item)
                        }
                      >
                        <Text
                          className={`text-sm font-SoraMedium ${
                            bloqueado ? "text-red-600" : "text-gray-800"
                          }`}
                        >
                          {item}
                        </Text>
                        <Text
                          className={`text-xs mt-0.5 ${
                            bloqueado ? "text-red-400" : "text-green-500"
                          }`}
                        >
                          {bloqueado ? "Ocupado" : "Disponible"}
                        </Text>
                        {bloqueado && (
                          <View className="absolute -top-2  bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                            <X size={12} color="white" />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />

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
    </SafeAreaView>
  );
}
