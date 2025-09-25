import { confirmAccountRequest } from "@/lib/apis/Auth";
import { useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";



// Pantalla para validar código con PIN input usando NativeWind
export default function ValidarCodigo() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [remaining, setRemaining] = useState(120);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const route = useRoute();
  const { email } = route.params ;

  
  const routeDestination = email ? "/auth/changePassword" : "/";



  const mutation = useMutation({
    mutationFn: confirmAccountRequest,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: email ? "Codigo verificado" : "Cuenta habilitada",
        text2: email ? "Ahora puedes cambiar tu contraseña" : "Ahora puedes iniciar sesión para comenzar a jugar",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
      router.replace(routeDestination);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
    },
  });

  const handleSubmit = () => {
    if (code.some((digit) => digit === "")) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Completa todos los dígitos del código.",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
      return;
    }
    const finalCode = code.join("");

    mutation.mutate({ token: finalCode });
  };
  const handleChange = (text: string, index: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    // Inicia el temporizador de cuenta regresiva
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const resendCode = () => {
    // Simulación de reenvío: limpia inputs y reinicia el contador
    setCode(["", "", "", "", "", ""]);
    setRemaining(120);
    setTimeout(() => inputs.current[0]?.focus(), 50);
    router.replace("/auth/resendCodeValidateAccount");
  };

  return (
    <SafeAreaView className="h-[95%] bg-green-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center p-6"
      >
        <View className="bg-white/95 rounded-3xl shadow-xl p-6">
          <Text className="text-3xl font-SoraExtraBold text-center text-green-800 mb-6">
            Validar código
          </Text>
          <Text className="text-md font-Sora text-center text-gray-600  mb-6 tracking-tight">
            Ingresa el código de 6 dígitos que te enviamos a tu correo
            electrónico.
          </Text>

          <Text className="text-center text-md font-Sora text-gray-500 mb-4">
            Tiempo restante para validar:{" "}
            <Text className="font-SoraExtraBold text-green-700">
              {formatTime(remaining)}
            </Text>
          </Text>

          <View className="flex-row justify-between mb-2">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                value={digit}
                editable={!mutation.isPending}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                className="border border-gray-300 rounded-xl w-12 h-12 text-center text-lg bg-white"
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="mt-4 bg-green-700 rounded-xl py-4 items-center justify-center shadow-md font-SoraExtraBold flex-row gap-2"
            activeOpacity={0.85}
          >
            <Text className="text-white text-lg tracking-tight font-SoraExtraBold">Validar código</Text>
            <Check size={20} color="white" strokeWidth={3}/>
          </TouchableOpacity>
          {!email && (
          <TouchableOpacity
            onPress={resendCode}
            activeOpacity={0.8}
            className="mt-8"
          >
            <Text className={`text-sm font-Sora text-center underline`}>
              ¿No recibiste el código? Solicita uno nuevo
            </Text>
          </TouchableOpacity>
          )}
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
