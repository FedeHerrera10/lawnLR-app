import { formatDate, parseDate } from '@/utils/DateUtil';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Copyright, Eye, EyeOff, IdCard, Lock, Mail, User, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  userSchema,
  User as UserType,
} from '../../constants/types';
import { createUserRequest } from '../../lib/apis/Auth';

type FormData = UserType;

// Pantalla de Registro para una app de tenis usando NativeWind + React Hook Form + Zod (schema compartido)
export default function RegistroTenis() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const mutation = useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {Toast.show({
      type: 'success',
      text1: 'Registro exitoso',
      text2: 'Debe validar su cuenta',
      text1Style: { fontSize: 18 },
      text2Style: { fontSize: 14 },
    });
      router.replace('/auth/validateCode');
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
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
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: 'fherrera12',
      firstname: 'federico',
      lastname: 'herrera',
      email: 'federico.herrera@outlook.com',
      roles: {
        cliente: true,
        admin: false,
        veterinario: false,
      },
      document: '37319074', 
      birthdate: '',
      password: '12345678',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  
  const onSubmit = (data: FormData) => {
    //mutation.mutate(data);
    router.replace('/auth/validateCode');
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView className="h-[95%] bg-green-50 ">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20  }} >
          <View className="bg-white/95 rounded-3xl shadow-xl p-6 mt-10">
            <Text className="text-3xl font-SoraExtraBold text-center text-green-800 mb-2 ">
              Crear cuenta
            </Text>
            <Text className="text-center text-gray-600 mb-6 font-Sora">
              Completa tus datos para comenzar a jugar
            </Text>

            {/* Username */}
            <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Usuario</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-2 bg-white flex-row items-center`}
                >
                  <User size={20} color="#065f46" />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Tu usuario"
                    className="flex-1 px-3 py-2.5 text-lg tracking-tight text-gray-900 font-Sora"
                    placeholderTextColor="#6b7280"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}
            />
            {errors.username && <Text className="text-red-500 text-base mb-2 font-Sora">{errors.username.message as string}</Text>}

            {/* Nombre */}
            <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Nombre</Text>
            <Controller
              control={control}
              name="firstname"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border ${errors.firstname ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-2 bg-white flex-row items-center`}
                >
                  <User size={20} color="#065f46" />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Tu nombre"
                    className="flex-1 px-3 py-2.5 text-lg tracking-tight text-gray-900 font-Sora"
                    placeholderTextColor="#6b7280"
                  />
                </View>
              )}
            />
            {errors.firstname && <Text className="text-red-500 text-base mb-2 font-Sora">{errors.firstname.message as string}</Text>}

            {/* Apellido */}
            <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Apellido</Text>
            <Controller
              control={control}
              name="lastname"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border ${errors.lastname ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-2 bg-white flex-row items-center`}
                >
                  <User size={20} color="#065f46" />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Tu apellido"
                    className="flex-1 px-3 py-2.5 text-lg tracking-tight text-gray-900 font-Sora"
                    placeholderTextColor="#6b7280"
                  />
                </View>
              )}
            />
            {errors.lastname && <Text className="text-red-500 text-base mb-2 font-Sora">{errors.lastname.message as string}</Text>}

           

            {/* Número de Documento */}
            <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Número de Documento</Text>
            <Controller
              control={control}
              name="document"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border ${errors.document ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-2 bg-white flex-row items-center`}
                >
                  <IdCard size={20} color="#065f46" />
                  <TextInput
                    value={value.toString()}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Ej: 12345678"
                    keyboardType="numeric"
                    className="flex-1 px-3 py-2.5 text-lg tracking-tight text-gray-900 font-Sora"
                    placeholderTextColor="#6b7280"
                  />
                </View>
              )}
            />
            {errors.document && (
              <Text className="text-red-500 text-base mb-2 font-Sora">{errors.document.message as string}</Text>
            )}

            {/* Fecha de Nacimiento */}
            <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Fecha de Nacimiento</Text>
            <Controller
              control={control}
              name="birthdate"
              render={({ field: { onChange, value } }) => {
                const dateValue = parseDate(value) || new Date(2000, 0, 1);
                return (
                  <>  
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.85}
                      className={`border ${errors.birthdate ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-2 bg-white`}
                    >
                      <View className="flex-row items-center">
                        <Calendar size={20} color="#065f46"/>
                        <Text className="ml-3 text-lg tracking-tight text-gray-900 font-Sora">
                          {value ? value : 'DD/MM/AAAA'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={dateValue}
                        mode="date"
                        textColor="black"        // 👈 color del texto/rueda
                        accentColor="#16a34a" 
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: '#16a34a',
                          
                        }}
                        onChange={(event, selectedDate) => {
                          if (Platform.OS !== 'ios') setShowDatePicker(false);
                          if (selectedDate) {
                            onChange(formatDate(selectedDate));
                          }
                        }}
                        maximumDate={new Date()}
                      />
                    )}
                    {Platform.OS === 'ios' && showDatePicker && (
                      <View className="flex-row justify-end gap-3 mt-2">
                        <TouchableOpacity
                          className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text className="text-gray-800 font-Sora">Listo</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                );
              }}
            />
            {errors.birthdate && (
              <Text className="text-red-500 text-base mb-2 font-Sora">{errors.birthdate.message as string}</Text>
            )}

            {/*email*/}
            <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-5 py-3 mb-2 bg-white flex-row items-center`}
                >
                  <Mail size={20} color="#065f46" />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Tu email"
                    className="flex-1 px-3 py-2.5 text-lg tracking-tight text-gray-900 font-Sora"
                    placeholderTextColor="#6b7280"
                  />
                </View>
              )}
            />
            {errors.email && <Text className="text-red-500 text-base mb-2">{errors.email.message as string}</Text>}

            {/* Contraseña */}
            <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">Contraseña</Text>
            <View className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-4 py-2 mb-2 bg-white flex-row items-center`}>
              <Lock size={20} color="#065f46" />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor="#6b7280"
                    className="flex-1 px-2 py-2.5 text-xl tracking-tight text-gray-900 font-Sora"
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)} activeOpacity={0.8}>
                {showPassword ? (
                  <EyeOff size={20} color="#065f46" />
                ) : (
                  <Eye size={20} color="#065f46" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-base mb-2 font-Sora">{errors.password.message as string}</Text>
            )}

           <TouchableOpacity
                   onPress={handleSubmit(onSubmit)}
                   disabled={mutation.isPending}
                   className="mt-4 bg-green-700 rounded-xl py-4  shadow-md flex-row gap-2 justify-center items-center"
                 >
                   <Text className="text-white font-SoraExtraBold text-lg">
                     {mutation.isPending ? "Registrando..." : "Registrarme"}
                   </Text>
                   <UserPlus size={20} color="white" strokeWidth={2}/>
                 </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-3 bg-white rounded-2xl py-4 items-center justify-center border border-gray-300 shadow-sm flex-row gap-2"
              activeOpacity={0.85}
            >
              <Text className="text-gray-800 font-SoraExtraBold text-lg  ">Regresar</Text>
              <ArrowLeft size={22} color="#065f46" strokeWidth={2}/>
            </TouchableOpacity>
          </View>

          <View className="items-center mt-10 flex-row justify-center gap-2">
            <Copyright size={20} color="green" />
                          <Text className="text-lg text-green-800 font-Sora">
                           Lawn Tennis LR 2025{" "}
                          </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}
