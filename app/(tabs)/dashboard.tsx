import CustomHeader from "@/components/ui/layout/CustomHeader";
import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
import { CalendarDays, DollarSign, LogOut, MapPin, Users } from "lucide-react-native";
import React from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardAdmin() {
  const screenWidth = Dimensions.get("window").width;
  const {signOut}= useAuth();
  const metrics = [
    { id: 1, title: "Reservas Hoy", value: 24, icon: CalendarDays, color: "bg-green-100", text: "text-green-700" },
    { id: 2, title: "Canchas Activas", value: 8, icon: MapPin, color: "bg-blue-100", text: "text-blue-700" },
    { id: 3, title: "Usuarios", value: 126, icon: Users, color: "bg-yellow-100", text: "text-yellow-700" },
    { id: 4, title: "Ingresos", value: "$12.500", icon: DollarSign, color: "bg-emerald-100", text: "text-emerald-700" },
  ];

  const reservas = [
    { id: "1", nombre: "Juan Pérez", cancha: "Cancha 1", hora: "10:00" },
    { id: "2", nombre: "Lucía Gómez", cancha: "Cancha 2", hora: "11:00" },
    { id: "3", nombre: "Carlos Díaz", cancha: "Cancha 3", hora: "14:00" },
  ];

  const chartData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        data: [15, 20, 18, 25, 30, 28, 22],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // verde
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#10B981",
    },
  };

  return (
    <CustomSafeAreaView style={{ flex: 1 , backgroundColor: "#b91c1c" }}>
        <CustomHeader title="Panel de Administración"
        subtitle="Resumen de Lawn App"
        rightButton={
                <TouchableOpacity onPress={() => signOut()}>  
                  <LogOut size={22} color="white" />
                </TouchableOpacity>
              } 
        containerClassName="bg-red-700" backgroundColor="red"/>
    <ScrollView className="flex-1 bg-gray-50 p-4">

      {/* Tarjetas de métricas */}
      <View className="flex-row flex-wrap justify-between ">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <View
              key={item.id}
              className={`w-[48%] rounded-2xl p-4 mb-4 ${item.color} shadow`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-medium text-gray-700">{item.title}</Text>
                <Icon size={20} color="#374151" />
              </View>
              <Text className={`text-xl font-semibold ${item.text}`}>{item.value}</Text>
            </View>
          );
        })}
      </View>

      {/* Gráfica de reservas semanales */}
      <View className="bg-white rounded-2xl p-4 shadow mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Reservas semanales</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: 12,
          }}
        />
      </View>

      
    </ScrollView>
    </CustomSafeAreaView>
  );
}
