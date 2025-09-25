import { router } from 'expo-router';
import React from 'react';
import { Control, FieldErrors, SubmitHandler, UseFormHandleSubmit } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { ResendCodeProps } from '@/constants/types';
import { UseMutationResult } from '@tanstack/react-query';
import { ArrowLeft, Send } from 'lucide-react-native';
import { FormInput } from '../ui/inputs/FormInput';
import CopyrightText from '../ui/text/CopyrightText';
type SendCodeValidationProps = {
    control: Control<ResendCodeProps>;
    handleSubmit: UseFormHandleSubmit<ResendCodeProps>;
    errors: FieldErrors<ResendCodeProps>;
    onSubmit: SubmitHandler<ResendCodeProps>;
    mutation: UseMutationResult<any, any, ResendCodeProps, unknown>;
}


export default function ResendCodeScreen({ control, handleSubmit, errors, onSubmit, mutation }: SendCodeValidationProps) {

    return (
    <SafeAreaView className="h-[95%] bg-green-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center p-6"
      >
        <View className="bg-white/95 rounded-3xl shadow-xl p-8">
          <Text className="text-2xl font-SoraExtraBold text-center text-green-800 mb-2">
            Reenviar código
          </Text>
          <Text className="text-base font-Sora text-center text-gray-600 mb-6">
            Ingresa tu correo para enviarte un nuevo código de validación.
          </Text>

          <FormInput control={control} name="email" label="Correo electrónico" placeholder='tu@correo.com'  error={errors.email?.message}  editable={!mutation.isPending}/>  

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
            className="mt-2 bg-green-700 rounded-xl py-4 items-center justify-center shadow-md flex-row gap-2"
            activeOpacity={0.85}
          >
            <Text className="text-white font-SoraExtraBold text-lg">
              {mutation.isPending ? 'Enviando...' : 'Enviar código'}
            </Text>
            <Send size={20} color="white" strokeWidth={2}/>
          </TouchableOpacity>

          <TouchableOpacity
              onPress={() => router.replace('/')}
              className="mt-3 bg-white rounded-2xl py-4 items-center justify-center border border-gray-300 shadow-sm flex-row gap-2"
              activeOpacity={0.85}
            >
              <Text className="text-gray-800 font-SoraExtraBold text-lg  ">Regresar</Text>
              <ArrowLeft size={22} color="#065f46" strokeWidth={2}/>
            </TouchableOpacity>



        </View>
        <CopyrightText color='green' size={20} textColor='green-800'/>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
