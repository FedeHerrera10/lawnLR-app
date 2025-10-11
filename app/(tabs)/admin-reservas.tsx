import CustomHeader from "@/components/ui/layout/CustomHeader";
import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
import api from "@/lib/apiaxios";
import { getToken } from "@/lib/secureStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router/build/imperative-api";
import { ArrowLeft, Calendar, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
// ---------------- Types ---------------- //
type EstadoReserva = "PENDIENTE" | "PAGADA" | "CANCELADA";

interface Jugador {
  dni: string;
  esSocio: boolean;
}

interface Reserva {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  canchaId: number;
  canchaNombre: string;
  fecha: string;
  horarios: string[];
  jugadores: Jugador[];
  montoTotal: number;
  estado: EstadoReserva;
}

// ---------------- Component ---------------- //
export default function AdminReservas() {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reserva[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<EstadoReserva | "ALL">("ALL");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mostrarFechaPicker, setMostrarFechaPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // ----------- FETCH RESERVAS --------------- //
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Usuario no autenticado");

        const response = await api.get("/api/reservas", {
           headers: { Authorization: `Bearer ${token}` },
        });

        setReservations(response.data);
        setFilteredReservations(response.data);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
        Toast.show({
          type: "error",
          text1: "Error al cargar reservas",
          text2: "No se pudieron cargar las reservas del sistema",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  // ----------- FILTROS --------------- //
  useEffect(() => {
    filterReservations();
  }, [selectedStatus, selectedDate, reservations]);

  const filterReservations = () => {
    let result = [...reservations];

    // Filtrar por estado
    if (selectedStatus !== "ALL") {
      result = result.filter((r) => r.estado === selectedStatus);
    }

    // Filtrar por fecha
    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split("T")[0];
      result = result.filter((r) => r.fecha === selectedDateStr);
    }

    setFilteredReservations(result);
  };

  // ----------- UTILS --------------- //
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "PAGADA":
        return "bg-green-100 text-green-800";
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELADA":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "PAGADA":
        return "Pagada";
      case "PENDIENTE":
        return "Pendiente";
      case "CANCELADA":
        return "Cancelada";
      default:
        return "";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ---------------- UI ---------------- //
  return (
    <CustomSafeAreaView style={{flex: 1, backgroundColor: "#b91c1c"}}>
      {/* Header */}
      <View className="flex-1 bg-red-700">
        
      
      <CustomHeader 
      backgroundColor="red"
      containerClassName="bg-red-700"
      title="Administracion de Reservas"
      subtitle="Busca las reservas realizadas"
      leftButton={
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color="white" />
        </TouchableOpacity>
      }

      rightButton={
        <TouchableOpacity onPress={() => setMostrarFechaPicker(true)}>
          <Calendar size={22} color="white" />
        </TouchableOpacity>
      }
      />


        {/* Filtro de fecha seleccionada */}
        {selectedDate && (
          <View className="mt-4 flex-row items-center justify-between bg-white/20 p-2 rounded-lg">
            <Text className="text-white font-SoraMedium">
              Filtrado: {formatDate(selectedDate)}
            </Text>
            <TouchableOpacity onPress={() => setSelectedDate(null)}>
              <X size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      

      {/* Status Filters */}
      <View className="bg-white px-4 pt-2 pb-1 shadow-sm">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {[
            { label: "Todas", value: "ALL" },
            { label: "Pendientes", value: "PENDIENTE" },
            { label: "Pagadas", value: "PAGADA" },
            { label: "Canceladas", value: "CANCELADA" },
          ].map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedStatus === value ? "bg-red-50" : "bg-gray-50"
              }`}
              onPress={() => setSelectedStatus(value as any)}
            >
              <Text
                className={`font-SoraMedium text-sm ${
                  selectedStatus === value ? "text-red-700" : "text-gray-700"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date Picker Modal */}
      {mostrarFechaPicker && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-10">
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="calendar"
            onChange={(event, date) => {
              setMostrarFechaPicker(false);
              if (date) {
                setSelectedDate(date);
              }
            }}
            minimumDate={new Date(2023, 0, 1)}
            maximumDate={new Date(2050, 0, 1)}
          />
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="px-4 py-2 bg-gray-200 rounded-lg"
              onPress={() => setMostrarFechaPicker(false)}
            >
              <Text className="font-SoraMedium">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-red-700 rounded-lg"
              onPress={() => {
                setSelectedDate(new Date());
                setMostrarFechaPicker(false);
              }}
            >
              <Text className="text-white font-SoraMedium">Hoy</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Reservations List */}
      <ScrollView className="flex-1 p-4 bg-gray-50">
        {loading ? (
          <View className="mt-20 items-center justify-center">
            <ActivityIndicator size="large" color="#b91c1c" />
            <Text className="text-gray-600 mt-2">Cargando reservas...</Text>
          </View>
        ) : filteredReservations.length === 0 ? (
          <View className="bg-white rounded-2xl p-6 items-center justify-center mt-8">
            <Text className="text-gray-500 text-center text-lg font-SoraMedium">
              No hay reservas {selectedStatus !== "ALL" ?  `en estado ${getStatusText(selectedStatus)}` : ""}
              {selectedDate ? ` para el ${formatDate(selectedDate)}` : ""}
            </Text>
          </View>
        ) : (
          filteredReservations.map((r) => (
            <View
              key={r.id}
              className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-SoraBold text-gray-900">
                  {r.usuarioNombre}
                </Text>
                <View
                  className={`px-2 py-1 rounded-full ${getStatusColor(r.estado)}}`}
                >
                  <Text className="text-xs font-SoraMedium">
                    {getStatusText(r.estado)}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 font-SoraMedium">
                📍 {r.canchaNombre}
              </Text>

              <Text className="text-gray-600 text-sm mt-1">
                📅 {formatDate(new Date(r.fecha))} - ⏰ {r.horarios.join(" - ")}
              </Text>

              <Text className="text-gray-600 text-sm mt-1">
                👥 Jugadores: {r.jugadores.map((j) => j.dni).join(", ")}
              </Text>

              <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100">
                <Text className="text-gray-800 font-SoraSemiBold">
                  💵 ${r.montoTotal.toLocaleString("es-AR")}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>   
      </View>
    </CustomSafeAreaView>
  );
}