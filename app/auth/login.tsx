import LoginForm from "@/components/auth/LoginForm";
import { Link } from "expo-router";
import { Copyright } from "lucide-react-native";
import React from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    View,
} from "react-native";

export default function LoginScreen() {
  return (
    <>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1580153111806-5007b971dfe7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        resizeMode="cover"
        className="h-[95%] "
      >
        <SafeAreaView className="flex-1 bg-emerald-800/40 ">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center p-6 "
          >
            <View className="bg-white/90 rounded-3xl shadow-xl p-8">
              <Text className="text-4xl  mb-3 text-green-800 text-center font-SoraExtraBold">
                Lawn Tennis LR
              </Text>
              <Text className="text-lg text-gray-600 mb-6 text-center font-Sora">
                Reserva tu cancha y vive el tenis
              </Text>

              <LoginForm />

              <View className="flex-row justify-between items-center mt-5">
                <Link href="/auth/changePassword">
                  <Text className="text-md text-green-700 font-Sora">
                    ¿Olvidaste tu contraseña?
                  </Text>
                </Link>
                <Link href="/auth/register">
                  <Text className="text-md text-gray-700 font-Sora">Crear cuenta</Text>
                </Link>
              </View>
            </View>
            <View className="items-center mt-6 flex-row gap-2 justify-center">
              <Copyright size={20} color="white" />
              <Text className="text-lg text-gray-200 font-Sora">
               Lawn Tennis LR 2025{" "}
              </Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
