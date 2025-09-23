import CustomTabBar from "@/components/ui/CustomTabBar";
import { router, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function TabLayout() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-3 text-base text-gray-600">Cargando...</Text>
      </View>
    );
  }

  if (!data) {
    router.replace("/");
    return null; // evita que siga al Tabs
  }

  const isAdmin = data.roles?.some((r: any) => r.name === "ROLE_ADMIN");
  const isUser  = data.roles?.some((r: any) => r.name === "ROLE_CLIENT");

  return (
    <SafeAreaView className="h-[95%]">
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} isUser={isUser} />} 
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="user-home" />
      <Tabs.Screen name="administracion" />
         </Tabs>
    </SafeAreaView>
  );
}
