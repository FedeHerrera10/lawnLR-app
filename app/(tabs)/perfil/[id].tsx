import { useLocalSearchParams, useRouter } from "expo-router";
import { LogOut, Pencil, Settings, User } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import CustomToast from "@/components/ui/CustomToast";
import CustomHeader from "@/components/ui/layout/CustomHeader";
import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
import TennisBallLoader from "@/components/ui/Loader";
import ConfigModal from "@/components/user/config";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/UseContext";
import { getUserById } from "@/lib/apis/User";
import { useQuery } from "@tanstack/react-query";

export default function PerfilScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showConfig, setShowConfig] = useState(false);
  const { setUser } = useUser();
  const { signOut } = useAuth();
  const {
    data: usuario,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["userprofile", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
    staleTime: 0,
  });

  if (isLoading) {
    return <TennisBallLoader />;
  }

  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const isAdmin = usuario?.roles[0].name === "ROLE_ADMIN";
  const handleSetUser = () => {
    setUser(usuario);
    router.push(`/perfil/editar-perfil/${id}`);
  };

  if (isError) {
    return CustomToast({
      type: "error",
      title: "Error",
      message: "Error al cargar el perfil",
    });
  }

  if (usuario) {
    return (
      <CustomSafeAreaView
        style={{ flex: 1, backgroundColor: isAdmin ? "#b91c1c" : "#15803d" }}
      >
        {/* Header */}
        <CustomHeader
          title="Mi Perfil"
          subtitle="Información personal"
          leftButton={
            <TouchableOpacity onPress={() => setShowConfig(true)}>
              <Settings size={22} color="white" />
            </TouchableOpacity>
          }
          rightButton={
            <TouchableOpacity onPress={() => signOut()}>
              <LogOut size={22} color="white" />
            </TouchableOpacity>
          }
          containerClassName={isAdmin ? "bg-red-700" : "bg-green-700"}
          backgroundColor={isAdmin ? "red" : "green"}
        />

        <ScrollView className="flex-1 px-4 py-6 bg-gray-100">
          {/* Profile Card */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <View className="items-center mb-4">
              <View className="flex items-center justify-center">
                <View className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-lg flex justify-center items-center ">
                  <User size={32} color="black" strokeWidth={2} />
                </View>
              </View>
              <Text className="text-xl font-SoraBold text-gray-900 mt-4">
                {usuario.firstname} {usuario.lastname}
              </Text>
              <Text
                className={`${
                  isAdmin ? "text-red-700" : "text-green-700"
                } font-SoraMedium`}
              >
                {usuario.roles[0].name.replace("ROLE_", "")}
              </Text>
            </View>

            <View className="mt-6 space-y-4">
              <View className="flex-row justify-between pb-5 border-b border-gray-100">
                <Text className="text-gray-500 font-SoraMedium">Usuario</Text>
                <Text className="text-gray-900 font-SoraSemiBold">
                  {usuario.username}
                </Text>
              </View>
              <View className="flex-row justify-between pb-5 border-b border-gray-100">
                <Text className="text-gray-500 font-SoraMedium">Documento</Text>
                <Text className="text-gray-900 font-SoraSemiBold">
                  {usuario.document}
                </Text>
              </View>
              <View className="flex-row justify-between pb-5 border-b border-gray-100">
                <Text className="text-gray-500 font-SoraMedium">
                  Fecha de Nacimiento
                </Text>
                <Text className="text-gray-900 font-SoraSemiBold">
                  {usuario.birthdate ? formatDate(usuario.birthdate) : ""}
                </Text>
              </View>
              <View className="flex-row justify-between pb-5 border-b border-gray-100">
                <Text className="text-gray-500 font-SoraMedium">Email</Text>
                <Text className="text-gray-900 font-SoraSemiBold">
                  {usuario.email}
                </Text>
              </View>
              <View className="flex-row justify-between pb-5">
                <Text className="text-gray-500 font-SoraMedium">Telefono</Text>
                <Text className="text-gray-900 font-SoraSemiBold">
                  {usuario.numberPhone}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-5 mb-6">
            <TouchableOpacity
              onPress={handleSetUser}
              className={`${
                isAdmin ? "bg-red-700" : "bg-green-700"
              } py-4 rounded-xl flex-row items-center justify-center space-x-2 shadow-sm mb-5 gap-2`}
            >
              <Text className="text-white font-SoraBold text-lg">
                Editar Perfil
              </Text>
              <Pencil size={18} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/")}
              className="mt-2 bg-white text-black border border-gray-300 rounded-xl py-4 items-center shadow-md flex-row justify-center gap-2"
            >
              <Text className="text-black font-SoraBold text-lg">
                Cerrar Sesión
              </Text>
              <LogOut size={18} color="#991b1b" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ConfigModal showConfig={showConfig} setShowConfig={setShowConfig} />
      </CustomSafeAreaView>
    );
  }
}
