import { router } from 'expo-router';
import React from 'react';
import { Control, Controller, FieldErrors, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ResendCodeProps } from '@/constants/types';
import { UseMutationResult } from '@tanstack/react-query';
import { Mail } from 'lucide-react-native';
type SendCodeValidationProps = {
    control: Control<ResendCodeProps>;
    handleSubmit: UseFormHandleSubmit<ResendCodeProps>;
    errors: FieldErrors<ResendCodeProps>;
    onSubmit: SubmitHandler<ResendCodeProps>;
    mutation: UseMutationResult<any, any, ResendCodeProps, unknown>;
}


export default function ResendCodeScreen({ control, handleSubmit, errors, onSubmit, mutation }: SendCodeValidationProps) {

    return (
    <SafeAreaView className="flex-1 bg-green-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center p-6"
      >
        <View className="bg-white/95 rounded-3xl shadow-xl p-8">
          <Text className="text-2xl font-bold text-center text-green-800 mb-2">
            Reenviar código
          </Text>
          <Text className="text-base text-center text-gray-600 mb-6">
            Ingresa tu correo para enviarte un nuevo código de validación.
          </Text>

          <Text className="text-lg text-gray-900 font-semibold mb-2">Correo electrónico</Text>
          <Controller
        control={control}
        name="email"
        rules={{ required: "El correo electronico requerido" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            className={`border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-xl px-4 py-3 mb-2 bg-white flex-row items-center`}
          >
            <Mail size={20} color="#065f46" />
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Tu correo electrónico"
              className="flex-1 px-3 py-2.5 text-xl tracking-tight text-gray-900"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}
      />
    {errors.email && <Text className="text-red-500 text-base mb-2">{errors.email.message as string}</Text>}

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="mt-2 bg-green-700 rounded-xl py-4 items-center justify-center shadow-md"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-lg">
              {mutation.isPending ? 'Enviando...' : 'Enviar código'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/')}
            className="mt-3 bg-white rounded-2xl py-4 items-center justify-center border border-gray-300 shadow-sm"
            activeOpacity={0.85}
          >
            <Text className="text-gray-800 font-semibold text-lg">Cancelar / Volver</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
