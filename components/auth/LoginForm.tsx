import { loginRequest } from "@/lib/apis/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { LoginProps, loginSchema } from "../../constants/types";
import { saveToken } from "../../lib/secureStore";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    defaultValues: { username: "", password: "" },
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      saveToken(data.token);
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      if(error.message === "Su cuenta no esta habilitada!") {
        
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 14 },
        });
        router.replace('/auth/validateCode');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || "Credenciales inválidas",
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 14 },
        });
      }
    },
  });
  const onSubmit = (formData: LoginProps) => {
    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <>
    

      <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Usuario</Text>
      <Controller
        control={control}
        name="username"
        rules={{ required: "Usuario requerido" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            className={`border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-2xl px-5 py-3 mb-3 bg-white flex-row items-center`}
          >
            <User size={20} color="#065f46" />
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Tu usuario"
              className="flex-1 px-2 py-2.5 text-xl tracking-tight text-gray-900 font-Sora"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}
      />
    {errors.username && <Text className="text-red-500 text-base mb-2 font-Sora">{errors.username.message as string}</Text>}

      <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Contraseña</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: "Contraseña requerida" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            className={`border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-2xl px-5 py-3 mb-3 bg-white flex-row items-center`}
          >
            <Lock size={20} color="#065f46" />
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Tu contraseña"
              placeholderTextColor="#6b7280"
              className="flex-1 px-2 py-2.5 text-xl tracking-tight text-gray-900 font-Sora "
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((s) => !s)}
              activeOpacity={0.8}
            >
              {showPassword ? (
                <EyeOff size={20} color="#065f46" />
              ) : (
                <Eye size={20} color="#065f46" />
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    {errors.password && <Text className="text-red-500 text-base mb-2 font-Sora">{errors.password.message as string}</Text>}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
        className="mt-4 bg-green-700 rounded-xl py-4 items-center shadow-md flex-row justify-center gap-2"
      >

        <Text className="text-white font-SoraExtraBold text-lg">
          {mutation.isPending ? "Ingresando..." : "Iniciar Sesión"}
        </Text>
        <LogIn size={20} color="white" strokeWidth={2}/>
      </TouchableOpacity>
    </>
  );
}
