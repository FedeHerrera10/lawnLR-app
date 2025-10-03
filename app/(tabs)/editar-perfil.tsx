import { DateInput } from "@/components/ui/inputs/DateInput";
import { FormInput } from "@/components/ui/inputs/FormInput";
import { NumericInput } from "@/components/ui/inputs/NumericInput";
import { CopyrightText } from "@/components/ui/text/CopyrightText";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, IdCard, Mail, Phone, User } from "lucide-react-native";
import React from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { userUpdate, UserUpdate } from "../../constants/types";
import { useUser } from "../../hooks/UseContext";
import { createUserRequest } from "../../lib/apis/Auth";




// Pantalla de Registro para una app de tenis usando NativeWind + React Hook Form + Zod (schema compartido)
export default function RegistroTenis() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { invalidateQueries } = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Perfil actualizado",
        text2: "Debe validar su cuenta",
        text1Style: { fontSize: 18 }
      });
      invalidateQueries({
        queryKey: ["user", user?.id],
      });
      router.replace("/auth/validateCode");
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdate>({
    resolver: zodResolver(userUpdate),
    defaultValues: {
      username: user?.username,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      document: user?.document  || "",
      birthdate: user?.birthdate || "",
      numberPhone: user?.numberPhone || "",
    },
    
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: UserUpdate) => {
    try {
    
    await invalidateQueries({
      queryKey: ["user", id],
    });
    router.push(`/perfil/${id}`);
    } catch (error) {
      console.log(error);
     
    }
    
    //mutation.mutate(data);
    
  };

  return (
    <SafeAreaProvider>
      <View className="bg-red-700 px-6 py-8 rounded-b-3xl shadow-md">
          <View className="flex-row mt-8 justify-between items-center">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.back()}
              className="p-1 -ml-2"
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-SoraExtraBold">
             Editar Perfil
            </Text>
            <TouchableOpacity
              className="p-1 -mr-2"
            >
              </TouchableOpacity>
          </View>
        </View> 
      <SafeAreaView className="flex-1 ">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 20,
            }}
          >
            <View className="bg-white/95 rounded-3xl shadow-xl p-6 mt-10">
              {/*Img Profile*/}
              
                <View className="flex items-center justify-center">
                <View className="w-24 h-24 rounded-full border-2 border-green-700 shadow-lg flex justify-center items-center ">
                  <User size={32} color="black" strokeWidth={2} />
                </View>
                </View>
            

              {/* Username */}
              <FormInput
                control={control}
                name="username"
                label="Usuario"
                placeholder="Ej: fherrera10"
                icon={<User size={20} color="#065f46" strokeWidth={2} />}
                editable={!mutation.isPending}
                error={errors.username?.message}
              />

              {/* Nombre */}
              <FormInput
                control={control}
                name="firstname"
                label="Nombre"
                placeholder="Tu nombre"
                icon={<User size={20} color="#065f46" strokeWidth={2} />}
                editable={!mutation.isPending}
                error={errors.firstname?.message}
              />

              {/* Apellido */}
              <FormInput
                control={control}
                name="lastname"
                label="Apellido"
                placeholder="Tu apellido"
                icon={<User size={20} color="#065f46" strokeWidth={2} />}
                editable={!mutation.isPending}
                error={errors.lastname?.message}
              />

              {/* Número de Documento */}
              <NumericInput
                control={control}
                name="document"
                label="Número de Documento"
                placeholder="Tu número de documento"
                icon={<IdCard size={20} color="#065f46" strokeWidth={2} />}
                editable={!mutation.isPending}
                error={errors.document?.message}
              />

              {/* Fecha de Nacimiento */}
              <DateInput
                control={control}
                name="birthdate"
                label="Fecha de Nacimiento"
                editable={!mutation.isPending}
                error={errors.birthdate?.message}
              />

              {/*email*/}
              <FormInput
                control={control}
                name="email"
                label="Correo electrónico"
                placeholder="tu@correo.com"
                icon={<Mail size={20} color="#065f46" />} // el icono que quieras
                inputProps={{
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                  autoCorrect: false,
                  textContentType: "emailAddress",
                }}
                error={errors.email?.message}
              />

               {/* Número de Documento */}
               <NumericInput
                control={control}
                name="numberPhone"
                label="Número de Teléfono"
                placeholder="Tu número de teléfono"
                icon={<Phone size={20} color="#065f46" strokeWidth={2} />}
                editable={!mutation.isPending}
                error={errors.numberPhone?.message}
              />
              

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={mutation.isPending}
                className="mt-4 bg-green-700 rounded-xl py-4  shadow-md flex-row gap-2 justify-center items-center"
              >
                <Text className="text-white font-SoraExtraBold text-lg">
                  {mutation.isPending ? "Actualizando..." : "Actualizar"}
                </Text>
                <Check size={20} color="white" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <CopyrightText color="green" size={20} textColor="green-700" />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
