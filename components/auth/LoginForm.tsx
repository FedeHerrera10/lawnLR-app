import { FormInput } from "@/components/ui/inputs/FormInput";
import { loginRequest } from "@/lib/apis/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { LogIn, User } from "lucide-react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { LoginProps, loginSchema } from "../../constants/types";
import { saveToken } from "../../lib/secureStore";
import { PasswordInput } from "../ui/inputs/PasswordInput";

export default function LoginScreen() {
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
    mutation.mutate(formData);
  };

  return (
    <>

      <FormInput control={control} name="username" label="Usuario" placeholder="Ingrese su usuario" icon={<User size={20} color="#065f46" />}  editable={!mutation.isPending} error={errors.username?.message} />
      <PasswordInput  control={control} name="password" label="Contraseña" editable={!mutation.isPending} error={errors.password?.message} />
      

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
