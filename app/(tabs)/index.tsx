// app/(tabs)/index.tsx
import { Redirect, router } from "expo-router";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../../hooks/useAuth";

export default function Index() {
  const { data, isLoading } = useAuth();
  

  if (isLoading)
    return (
      <Loader />
    );

  if (!data) return router.replace("/");

  const isAdmin = data.roles[0].name === "ROLE_ADMIN";

  return isAdmin ? (
    <Redirect href="/(tabs)/dashboard" />
  ) : (
    <Redirect href="/(tabs)/user-home" />
  ); // 👈 esta será tu pantalla de usuario
}
