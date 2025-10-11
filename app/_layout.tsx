import { UserProvider } from "@/hooks/UseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

const queryClient = new QueryClient();


const RootLayout = () => {
  
  const [loaded] = useFonts({
    "Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
    "Sora-Bold": require("../assets/fonts/Sora-Bold.ttf"),
    "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Medium": require("../assets/fonts/Sora-Medium.ttf"),
    "Sora-ExtraBold": require("../assets/fonts/Sora-ExtraBold.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SafeAreaProvider className="flex-1" style={{ backgroundColor: "black" }}>
          <Slot />
        </SafeAreaProvider>
        <Toast position="top" />
      </UserProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
