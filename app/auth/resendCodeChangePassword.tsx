import { ResendCodeProps, resendCodeSchema } from '@/constants/types';
import { resendCodeChangePassword } from '@/lib/apis/Auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import SendCodeValidation from '@/components/auth/SendCodeValidation';

export default function ResendCodeChangePassword() {

    const {
      control,
      handleSubmit,
      formState: { errors },
      watch
    } = useForm<ResendCodeProps>({
      defaultValues: { email: "" },
      resolver: zodResolver(resendCodeSchema),
    });
    const router = useRouter();

      
    const mutation = useMutation({
    mutationFn: resendCodeChangePassword,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Código reenviado',
        text2: 'Revisa tu correo para validar tu cuenta',
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
      router.push({ pathname: '/auth/validateCode', params: { email: watch('email') } });

    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'No se pudo reenviar el código',
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
      });
    },
  });

  

  const onSubmit = (formData: ResendCodeProps) => {
    mutation.mutate(formData);
  };

  return (
    
    <SendCodeValidation
    control={control}
    handleSubmit={handleSubmit}
    errors={errors}
    onSubmit={onSubmit}
    mutation={mutation}
  />
  
  );
}
