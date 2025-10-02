import { FormInput } from "@/components/ui/inputs/FormInput";
import { loginRequest } from "@/lib/apis/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LogIn, User } from "lucide-react-native";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { LoginProps, loginSchema } from "../../constants/types";
import { saveToken, userAndPassBiometric } from "../../lib/secureStore";
import { PasswordInput } from "../ui/inputs/PasswordInput";

type LoginFormProps = {
  isBiometricEnabled: boolean;
  handleEnableBiometry: () => Promise<boolean>;
  setBiometryEnabled: (enabled: boolean) => void;
  isLoginWithBiometric: boolean;
};

export default function LoginScreen({
  isBiometricEnabled,
  handleEnableBiometry,
  setBiometryEnabled,
  isLoginWithBiometric,
}: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    defaultValues: { username: "fherrera10", password: "12345678" },
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleLoginBiometric = async () => {
    if (isBiometricEnabled) {
      const success = await handleEnableBiometry();
      if (success) {
        loginWithDataBiometric();
      }
    }
  };

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      await saveToken(data.token);
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      if (error.message === "Su cuenta no esta habilitada!") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 14 },
        });
        router.replace("/auth/validateCode");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message || "Credenciales inválidas",
          text1Style: { fontSize: 18 },
          text2Style: { fontSize: 14 },
        });
      }
    },
  });

  const onSubmit = async (formData: LoginProps) => {
    try {
      // Save credentials for biometric login
      await userAndPassBiometric(formData.username, formData.password);

      // Proceed with the login
      mutation.mutate(formData);

      // Save token
      //await saveToken(result.token);

      // If biometrics are enabled, navigate to home
      //   if (isBiometricEnabled) {
      //     router.replace("/(tabs)");
      //   } else {
      //     // Otherwise, ask to enable biometrics
      //     const success = await handleEnableBiometry();
      //     if (success) {
      //       setBiometryEnabled(true);
      //       router.replace("/(tabs)");
      //     } else {
      //       // If user doesn't want to enable biometrics, just navigate
      //       router.replace("/(tabs)");
      //     }
      //   }
    } catch (error: any) {
      console.error("Login error:", error);
    }
    //   if (error.message === "Su cuenta no esta habilitada!") {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Error',
    //       text2: error.message,
    //       text1Style: { fontSize: 18 },
    //       text2Style: { fontSize: 14 },
    //     });
    //     router.replace('/auth/validateCode');
    //   } else {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Error',
    //       text2: error.message || "Credenciales inválidas",
    //       text1Style: { fontSize: 18 },
    //       text2Style: { fontSize: 14 },
    //     });
    //   }
    // }
  };

  const loginWithDataBiometric = async () => {
    try {
      const user = await SecureStore.getItemAsync("user");
      const pass = await SecureStore.getItemAsync("pass");

      if (user && pass) {
        mutation.mutate({ username: user, password: pass });
      }
    } catch (error) {
      console.error("Error al iniciar sesión con biometría:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo iniciar sesión con huella digital",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
    }
  };

  useEffect(() => {
    if (isLoginWithBiometric) {
      handleLoginBiometric();
    }
  }, [isLoginWithBiometric]);

  return (
    <>
      <FormInput
        control={control}
        name="username"
        label="Usuario"
        placeholder="Ingrese su usuario"
        icon={<User size={20} color="#065f46" />}
        editable={!mutation.isPending}
        error={errors.username?.message}
      />
      <PasswordInput
        control={control}
        name="password"
        label="Contraseña"
        editable={!mutation.isPending}
        error={errors.password?.message}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
        className="mt-4 bg-green-700 rounded-xl py-4 items-center shadow-md flex-row justify-center gap-2"
      >
        <Text className="text-white font-SoraExtraBold text-lg">
          {mutation.isPending ? "Ingresando..." : "Iniciar Sesión"}
        </Text>
        <LogIn size={20} color="white" strokeWidth={2} />
      </TouchableOpacity>
    </>
  );
}
