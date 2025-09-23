// app/(tabs)/index.tsx
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function Index() {
  const { data, isLoading } = useAuth();

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-3 text-base text-gray-600">Cargando...</Text>
      </View>
    );

  if (!data) return router.replace("/");

  const isAdmin = data.roles[0].name === "ROLE_ADMIN";

  return isAdmin ? (
    <Redirect href="/(tabs)/administracion" />
  ) : (
    <Redirect href="/(tabs)/user-home" />
  ); // 👈 esta será tu pantalla de usuario
}
