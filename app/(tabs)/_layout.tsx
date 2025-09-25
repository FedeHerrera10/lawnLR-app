import CustomTabBar from "@/components/ui/CustomTabBar";
import { router, Tabs } from "expo-router";
import { Calendar, User } from "lucide-react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import TennisBallLoader from "../../components/ui/Loader";
import { useAuth } from "../../hooks/useAuth";

export default function TabLayout() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return (
      <TennisBallLoader />
    );
  }

  if (!data) {
    router.replace("/");
    return null; // evita que siga al Tabs
  }

  const isAdmin = data.roles?.some((r: any) => r.name === "ROLE_ADMIN");
  const isUser  = data.roles?.some((r: any) => r.name === "ROLE_CLIENT");

  const TABSUSER = [
    { name: "user-home", label: "Reserva", icon: Calendar },
    { name: "mis-reservas", label: "Mis Reservas", icon: Calendar },
    { name: "perfil/[id]", label: "Perfil", icon: User, id: data.id },
    { name: "admincanchas", label: "Canchas", icon: Calendar },
    
  ];
  
  const TABSADMIN = [ 
    { name: "administracion", label: "Administracion", icon: Calendar },
    { name: "admin-reservas", label: "Reserva", icon: Calendar },
    { name: "perfil/[id]", label: "Perfil", icon: User , id: data.id},
    { name: "admincanchas", label: "Canchas", icon: Calendar },
  ];

  const TABS = isAdmin ? TABSADMIN : TABSUSER;

  return (
    <SafeAreaView className="h-[95%]">
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} isUser={isUser} TABS={TABS} />} 
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="user-home" />
      <Tabs.Screen name="administracion" /> 
      <Tabs.Screen name="perfil/[id]" />   {/* 👈 ruta dinámica */}
         </Tabs>
    </SafeAreaView>
  );
}
