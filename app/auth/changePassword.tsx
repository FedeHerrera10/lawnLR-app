import { changePasswordProps, changePasswordRequest, changePasswordSchema } from '@/constants/types';
import { passwordResetRequest } from '@/lib/apis/Auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ArrowLeft, Copyright, Eye, EyeOff, Key, Lock, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function OlvidePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<changePasswordProps>({
    defaultValues: { email:  '', password: '', confirmPassword: '' },
    resolver: zodResolver(changePasswordSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: changePasswordRequest) => passwordResetRequest(data),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Contraseña actualizada',
        text2: 'Tu contraseña fue cambiada correctamente.',
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
      router.replace('/');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'No se pudo actualizar la contraseña',
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
    }
  });

  const onSubmit = (data: changePasswordProps) => {
    const payload: changePasswordRequest = { email: data.email, password: data.password };
    mutation.mutate(payload);
  };

  return (
    <SafeAreaView className="h-[95%] bg-green-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center p-6"
      >
        <View className="bg-white/95 rounded-3xl shadow-xl p-6">
          <Text className="text-3xl  text-center text-green-800 mb-6 font-SoraExtraBold">
            Recuperar contraseña
          </Text>
          <Text className="text-gray-600 text-center mb-6 font-Sora">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>

          <Text className="text-lg text-gray-900 font-semibold mb-2 font-SoraExtraBold">Usuario (correo)</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-3 bg-white flex-row items-center`}
              >
                <User size={20} color="#065f46" />
                <TextInput
                  editable={!mutation.isPending}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="tuemail@correo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 px-3 py-2.5 text-xl tracking-tight text-gray-900 font-Sora"
                  placeholderTextColor="#6b7280"
                  autoCorrect={false}
                />
              </View>
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-base mb-2 font-Sora">{errors.email.message as string}</Text>
          )}

          <Text className="text-lg text-gray-900 font-semibold mb-2 font-SoraExtraBold">Nueva contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-3 bg-white flex-row items-center`}
              >
                <Lock size={20} color="#065f46" />
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#6b7280"
                  className="flex-1 px-3 py-2.5 text-xl tracking-tight text-gray-900 font-Sora"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword((s) => !s)} activeOpacity={0.8}>
                  {showPassword ? (
                    <EyeOff size={20} color="#065f46" />
                  ) : (
                    <Eye size={20} color="#065f46" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-base mb-2 font-Sora">{errors.password.message as string}</Text>
          )}

          <Text className="text-lg text-gray-900 font-semibold mb-2 font-SoraExtraBold">Repetir contraseña</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={`border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-3 bg-white flex-row items-center`}
              >
                <Lock size={20} color="#065f46" />
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Repetir Contraseña"
                  placeholderTextColor="#6b7280"
                  className="flex-1 px-3 py-2.5 text-xl tracking-tight text-gray-900 font-Sora"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirm((s) => !s)} activeOpacity={0.8}>
                  {showConfirm ? (
                    <EyeOff size={20} color="#065f46" />
                  ) : (
                    <Eye size={20} color="#065f46" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-base mb-2 font-Sora">{errors.confirmPassword.message as string}</Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="mt-4 bg-green-700 rounded-xl py-4 items-center justify-center shadow-md flex-row gap-2"
            activeOpacity={0.85}
          >
            <Text className="text-white font-SoraExtraBold text-lg">{mutation.isPending ? 'Guardando...' : 'Cambiar contraseña'}</Text>
            <Key size={18} color="#fff" strokeWidth={3} />
          </TouchableOpacity>
          <TouchableOpacity
                onPress={() => router.back()}
                className="mt-3 bg-white rounded-2xl py-4 items-center justify-center border border-gray-300 shadow-sm flex-row gap-2"
                activeOpacity={0.85}
              >
                <Text className="text-gray-800 font-SoraExtraBold text-lg  ">
                  Regresar
                </Text>
                <ArrowLeft size={22} color="#065f46" strokeWidth={2} />
              </TouchableOpacity>
        </View>
        <View className="items-center mt-10 flex-row justify-center gap-2">
              <Copyright size={20} color="green" /> 
              <Text className="text-lg text-green-800 font-Sora">
                Lawn Tennis LR 2025{" "}
              </Text>
            </View>   
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
