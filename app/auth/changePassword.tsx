import { FormInput } from '@/components/ui/inputs/FormInput';
import { PasswordInput } from '@/components/ui/inputs/PasswordInput';
import { CopyrightText } from '@/components/ui/text/CopyrightText';
import { changePasswordProps, changePasswordRequest, changePasswordSchema } from '@/constants/types';
import { passwordResetRequest } from '@/lib/apis/Auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ArrowLeft, Key, Mail } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function OlvidePassword() {

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

          <FormInput control={control} name="email" label="Correo electrónico" placeholder='tu@correo.com' error={errors.email?.message} editable={!mutation.isPending} icon={<Mail size={20} color="#065f46" strokeWidth={2} />} />
          <PasswordInput control={control} name="password" label="Nueva contraseña" error={errors.password?.message} editable={!mutation.isPending} />

          <PasswordInput control={control} name="confirmPassword" label="Repetir contraseña"  error={errors.confirmPassword?.message} editable={!mutation.isPending} />
          

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
        <CopyrightText color="green" size={20} textColor="green-700" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
