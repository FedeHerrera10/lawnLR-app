import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import '../global.css';

// LoginScreen con un estilo moderno para una app de tenis usando NativeWind sin librerías extras.

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email) newErrors.email = 'El correo es obligatorio.';
    else if (!emailRegex.test(email)) newErrors.email = 'Correo inválido.';

    if (!password) newErrors.password = 'La contraseña es obligatoria.';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setTimeout(() => {
      Alert.alert('Bienvenido', `¡Listo para jugar, ${email}!`);
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=900&q=60' }}
        resizeMode="cover"
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center p-6 bg-black/50"
        >
          <View className="bg-white/90 rounded-3xl shadow-xl p-8">
            <Text className="text-3xl font-extrabold mb-3 text-green-800 text-center">MatchPoint</Text>
            <Text className="text-sm text-gray-600 mb-6 text-center">Reserva tu cancha y vive el tenis</Text>

            <Text className="text-sm text-gray-700 mb-2">Correo electrónico</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tuemail@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 mb-2 bg-white`}
              placeholderTextColor="#9ca3af"
            />
            {errors.email ? <Text className="text-red-500 mb-2">{errors.email}</Text> : null}

            <Text className="text-sm text-gray-700 mb-2">Contraseña</Text>
            <View className="flex-row items-center border rounded-xl px-4 bg-white mb-2">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 py-3"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="px-2 py-3">
                <Text className="text-sm text-green-700 font-semibold">{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text className="text-red-500 mb-2">{errors.password}</Text> : null}

            <TouchableOpacity
              onPress={handleSubmit}
              className="mt-4 bg-green-700 rounded-xl py-4 items-center justify-center shadow-md"
              activeOpacity={0.85}
            >
              <Text className="text-white font-bold text-lg">Entrar a la cancha</Text>
            </TouchableOpacity>

            <View className="flex-row justify-between items-center mt-5">
              <TouchableOpacity onPress={() => Alert.alert('Recuperar contraseña', 'Función pendiente') }>
                <Text className="text-sm text-green-700">¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('Crear cuenta', 'Función pendiente') }>
                <Text className="text-sm text-gray-700">Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="items-center mt-6">
            <Text className="text-xs text-gray-200">MatchPoint © 2025 · Vive el tenis</Text>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}