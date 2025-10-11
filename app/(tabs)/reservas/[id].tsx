// // app/(tabs)/admin-reservas.tsx
// import CustomHeader from "@/components/ui/layout/CustomHeader";
// import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { router } from "expo-router/build/imperative-api";
// import { ArrowLeft, Calendar } from "lucide-react-native";
// import { useEffect, useState } from "react";
// import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// // Types
// type ReservationStatus = "active" | "canceled" | "completed";

// interface Reservation {
//   id: number;
//   usuario: string;
//   cancha: string;
//   fecha: string;
//   hora: string;
//   precio: number;
//   status: ReservationStatus;
//   fechaCreacion: string;
// }

// // Mock data with statuses
// const mockReservas: Reservation[] = [
//   {
//     id: 1,
//     usuario: "Juan Pérez",
//     cancha: "Cancha 1",
//     fecha: "2025-09-20",
//     hora: "09:00",
//     precio: 1750,
//     status: "active",
//     fechaCreacion: "2025-09-19",
//   },
//   {
//     id: 2,
//     usuario: "María López",
//     cancha: "Cancha 3",
//     fecha: "2025-09-21",
//     hora: "18:00",
//     precio: 2100,
//     status: "canceled",
//     fechaCreacion: "2025-09-18",
//   },
//   {
//     id: 3,
//     usuario: "Carlos Díaz",
//     cancha: "Cancha 2",
//     fecha: "2025-09-22",
//     hora: "11:00",
//     precio: 1960,
//     status: "completed",
//     fechaCreacion: "2025-09-17",
//   },
//   {
//     id: 4,
//     usuario: "Ana García",
//     cancha: "Cancha 1",
//     fecha: "2025-09-23",
//     hora: "16:00",
//     precio: 1850,
//     status: "active",
//     fechaCreacion: "2025-09-20",
//   },
// ];

// export default function AdminReservas() {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [filteredReservations, setFilteredReservations] = useState<
//     Reservation[]
//   >([]);
//   const [selectedStatus, setSelectedStatus] = useState<
//     ReservationStatus | "all"
//   >("all");
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [mostrarFechaPicker, setMostrarFechaPicker] = useState(false);

//   useEffect(() => {
//     // Simulate API call
//     setReservations(mockReservas);
//     setFilteredReservations(mockReservas);
//   }, []);

//   useEffect(() => {
//     filterReservations();
//   }, [selectedStatus, selectedDate, reservations]);

//   const filterReservations = () => {
//     let result = [...reservations];

//     // Filter by status
//     if (selectedStatus !== "all") {
//       result = result.filter((r) => r.status === selectedStatus);
//     }

//     // Filter by date
//     if (selectedDate) {
//       const selectedDateStr = selectedDate.toISOString().split("T")[0];
//       result = result.filter((r) => r.fecha === selectedDateStr);
//     }

//     setFilteredReservations(result);
//   };

//   const getStatusColor = (status: ReservationStatus) => {
//     switch (status) {
//       case "active":
//         return "bg-blue-100 text-blue-800";
//       case "canceled":
//         return "bg-red-100 text-red-800";
//       case "completed":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString("es-AR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });
//   };

//   const getStatusText = (status: ReservationStatus | "all"): string => {
//     switch (status) {
//       case "active":
//         return "Activa";
//       case "canceled":
//         return "Cancelada";
//       case "completed":
//         return "Completada";
//       default:
//         return "";
//     }
//   };

//   return (
//     <CustomSafeAreaView style={{ flex: 1, backgroundColor: "#15803d" }}>
//       <CustomHeader
//         title="Reservas"
//         subtitle="Busca las reservas que realizaste"
//         leftButton={
//           <TouchableOpacity onPress={() => router.back()}>
//             <ArrowLeft size={22} color="white" />
//           </TouchableOpacity>
//         }
//         containerClassName="bg-green-700"
//         backgroundColor="green"
//       />

//       {/* Status Filters */}
//       <View className="bg-white px-4 pt-2 pb-1 shadow-sm">
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingVertical: 8 }}
//         >
//           <TouchableOpacity
//             className={`px-4 py-2 rounded-full mr-2 ${
//               selectedStatus === "all" ? "bg-red-50" : "bg-gray-50"
//             }`}
//             onPress={() => setSelectedStatus("all")}
//           >
//             <Text
//               className={`font-SoraMedium text-sm ${
//                 selectedStatus === "all" ? "text-red-700" : "text-gray-700"
//               }`}
//             >
//               Todas
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className={`px-4 py-2 rounded-full mr-2 ${
//               selectedStatus === "active" ? "bg-blue-50" : "bg-gray-50"
//             }`}
//             onPress={() => setSelectedStatus("active")}
//           >
//             <Text
//               className={`font-SoraMedium text-sm ${
//                 selectedStatus === "active" ? "text-blue-700" : "text-gray-700"
//               }`}
//             >
//               Activas
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className={`px-4 py-2 rounded-full mr-2 ${
//               selectedStatus === "completed" ? "bg-green-50" : "bg-gray-50"
//             }`}
//             onPress={() => setSelectedStatus("completed")}
//           >
//             <Text
//               className={`font-SoraMedium text-sm ${
//                 selectedStatus === "completed"
//                   ? "text-green-700"
//                   : "text-gray-700"
//               }`}
//             >
//               Completadas
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className={`px-4 py-2 rounded-full ${
//               selectedStatus === "canceled" ? "bg-red-50" : "bg-gray-50"
//             }`}
//             onPress={() => setSelectedStatus("canceled")}
//           >
//             <Text
//               className={`font-SoraMedium text-sm ${
//                 selectedStatus === "canceled" ? "text-red-700" : "text-gray-700"
//               }`}
//             >
//               Canceladas
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>

//       {/* Date Picker Modal */}
//       {mostrarFechaPicker && (
//         <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-10">
//           <DateTimePicker
//             value={selectedDate || new Date()}
//             mode="date"
//             display="calendar"
//             onChange={(event, date) => {
//               setMostrarFechaPicker(false);
//               if (date) {
//                 setSelectedDate(date);
//               }
//             }}
//             minimumDate={new Date(2023, 0, 1)}
//             maximumDate={new Date(2050, 0, 1)}
//           />
//           <View className="flex-row justify-between mt-4">
//             <TouchableOpacity
//               className="px-4 py-2 bg-gray-200 rounded-lg"
//               onPress={() => setMostrarFechaPicker(false)}
//             >
//               <Text className="font-SoraMedium">Cancelar</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="px-4 py-2 bg-red-700 rounded-lg"
//               onPress={() => {
//                 setSelectedDate(new Date());
//                 setMostrarFechaPicker(false);
//               }}
//             >
//               <Text className="text-white font-SoraMedium">Hoy</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {/* Reservations List */}
//       <ScrollView className="flex-1 p-4 bg-gray-50">
//         {filteredReservations.length === 0 ? (
//           <View className="bg-white rounded-2xl p-6 items-center justify-center mt-8">
//             <Text className="text-gray-500 text-center text-lg font-SoraMedium">
//               No hay reservas{" "}
//               {selectedStatus !== "all"
//                 ? `con estado "${getStatusText(selectedStatus)}"`
//                 : ""}
//               {selectedDate ? `para el ${formatDate(selectedDate)}` : ""}
//             </Text>
//           </View>
//         ) : (
//           filteredReservations.map((reservation) => (
//             <View
//               key={reservation.id}
//               className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100"
//             >
//               <View className="flex-row justify-between items-start mb-2">
//                 <Text className="text-lg font-SoraBold text-gray-900">
//                   {reservation.usuario}
//                 </Text>
//                 <View
//                   className={`px-2 py-1 rounded-full ${getStatusColor(
//                     reservation.status
//                   )}`}
//                 >
//                   <Text className="text-xs font-SoraMedium">
//                     {getStatusText(reservation.status)}
//                   </Text>
//                 </View>
//               </View>

//               <View className="flex-row items-center mb-1">
//                 <Text className="text-gray-600 font-SoraMedium">
//                   📍 {reservation.cancha}
//                 </Text>
//               </View>

//               <View className="flex-row items-center mb-2">
//                 <Calendar size={14} color="#6B7280" />
//                 <Text className="text-gray-600 text-sm ml-1">
//                   {formatDate(new Date(reservation.fecha))} - {reservation.hora}
//                 </Text>
//               </View>

//               <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
//                 <Text className="text-gray-800 font-SoraSemiBold">
//                   💵 ${reservation.precio.toLocaleString("es-AR")}
//                 </Text>
//                 <Text className="text-gray-500 text-xs">
//                   Creada: {formatDate(new Date(reservation.fechaCreacion))}
//                 </Text>
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </CustomSafeAreaView>
//   );
// }

import CustomHeader from "@/components/ui/layout/CustomHeader";
import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/apiaxios";
import { getToken } from "@/lib/secureStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router/build/imperative-api";
import { LogOut } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import Toast from "react-native-toast-message";
// Types
type ReservationStatus = "PENDIENTE" | "CANCELADA" | "PAGADA";

interface Jugador {
  dni: string;
  esSocio: boolean;
}

interface Reservation {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  canchaId: number;
  canchaNombre: string;
  fecha: string;
  horarios: string[];
  jugadores: Jugador[];
  montoTotal: number;
  estado: ReservationStatus;
}

// -------------------------------
export default function AdminReservas() {
  const { data: user } = useAuth(); // user viene de getUserLogged
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | "ALL">("ALL");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mostrarFechaPicker, setMostrarFechaPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        if (!user?.id) return;
        const token = await getToken();
        if (!token) throw new Error("Usuario no autenticado");        console.log(token);
        if (!token) throw new Error("Token no encontrado");
        
        const response = await api.get(
          `/api/reservas/usuario/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReservations(response.data);
        setFilteredReservations(response.data);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
        Toast.show({
          type: "error",
          text1: "Error al cargar reservas",
          text2: "No se pudieron cargar las reservas del usuario",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user]);

  // -------------------------------
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

  // -------------------------------
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

  // -------------------------------
  return (
    <CustomSafeAreaView style={{flex: 1, backgroundColor: "#15803d"}}>
      {/* Header */}
     

      <CustomHeader 
      containerClassName="bg-green-700"
      backgroundColor="green"
      title="Reservas"
      subtitle="Aqui puedes tus reservas"
      rightButton={<TouchableOpacity
        activeOpacity={0.85}
        className="ml-3"
        onPress={() => router.push("/(tabs)/user-home")}
      >
        <LogOut size={22} color="white" />
      </TouchableOpacity>}
      
      />
      <View className="flex-1 bg-gray-50">

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
                selectedStatus === value ? "bg-green-100" : "bg-gray-50"
              }`}
              onPress={() => setSelectedStatus(value as any)}
            >
              <Text
                className={`font-SoraMedium text-sm ${
                  selectedStatus === value
                    ? "text-green-700"
                    : "text-gray-700"
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
              if (date) setSelectedDate(date);
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
              className="px-4 py-2 bg-green-700 rounded-lg"
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
      <ScrollView className="flex-1 p-4">
        {loading ? (
          <View className="mt-20 items-center justify-center">
            <ActivityIndicator size="large" color="#16a34a" />
            <Text className="text-gray-600 mt-2">Cargando reservas...</Text>
          </View>
        ) : filteredReservations.length === 0 ? (
          <View className="bg-gray-200 rounded-2xl p-6 items-center justify-center mt-8">
            <Text className="text-gray-800 text-center text-lg font-SoraMedium">
              No tienes reservas {selectedStatus !== "ALL" ? ` ${getStatusText(selectedStatus)}` : ""}
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
                  className={`px-2 py-1 rounded-full ${getStatusColor(r.estado)}`}
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