import { router } from 'expo-router';
import { ArrowLeft, LogOut, Pencil, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PerfilScreen() {
  const usuario = {
    usuario: 'fherreral12',
    nombre: 'Federico',
    apellido: 'Herrera',
    documento: '37319074',
    nacimiento: '1995-03-12',
    email: 'federico.herrera@outlook.com',
    telefono: '+54 380 456789',
    rol: 'Socio',
    fechaAlta: '2024-01-15',
    avatar: 'https://i.pravatar.cc/300',
  };

  const [showConfig, setShowConfig] = useState(false);
  const [section, setSection] = useState<'menu' | 'terms' | 'faq'>('menu');

  const abrirWhatsApp = () => {
    const url = 'https://wa.me/5493804795097';
    Linking.openURL(url).catch(() =>
      alert('No se pudo abrir WhatsApp en este dispositivo')
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const darDeBajaCuenta = () => {
    alert('⚠️ Esta acción dará de baja tu cuenta. Confirmación pendiente.');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-red-700 px-6 py-8 rounded-b-3xl shadow-md">
        <View className="flex-row mt-8 justify-between items-center">
          <TouchableOpacity 
            activeOpacity={0.85} 
            onPress={() => router.back()}
            className="p-1 -ml-2"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-SoraExtraBold">Mi Perfil</Text>
          <TouchableOpacity 
            onPress={() => setShowConfig(true)}
            className="p-1 -mr-2"
          >
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Profile Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <View className="items-center mb-4">
            <Image
              source={{ uri: usuario.avatar }}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <Text className="text-xl font-SoraBold text-gray-900 mt-4">
              {usuario.nombre} {usuario.apellido}
            </Text>
            <Text className="text-red-700 font-SoraMedium">{usuario.rol}</Text>
          </View>

          <View className="mt-6 space-y-4">
            <View className="flex-row justify-between pb-5 border-b border-gray-100">
              <Text className="text-gray-500 font-SoraMedium">Usuario</Text>
              <Text className="text-gray-900 font-SoraSemiBold">{usuario.usuario}</Text>
            </View>
            <View className="flex-row justify-between pb-5 border-b border-gray-100">
              <Text className="text-gray-500 font-SoraMedium">Documento</Text>
              <Text className="text-gray-900 font-SoraSemiBold">{usuario.documento}</Text>
            </View>
            <View className="flex-row justify-between pb-5 border-b border-gray-100">
              <Text className="text-gray-500 font-SoraMedium">Nacimiento</Text>
              <Text className="text-gray-900 font-SoraSemiBold">{formatDate(usuario.nacimiento)}</Text>
            </View>
            <View className="flex-row justify-between pb-5 border-b border-gray-100">
              <Text className="text-gray-500 font-SoraMedium">Email</Text>
              <Text className="text-gray-900 font-SoraSemiBold">{usuario.email}</Text>
            </View>
            <View className="flex-row justify-between pb-5">
              <Text className="text-gray-500 font-SoraMedium">Teléfono</Text>
              <Text className="text-gray-900 font-SoraSemiBold">{usuario.telefono}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-5 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/editar-perfil')}
            className="bg-red-700 py-4 rounded-xl flex-row items-center justify-center space-x-2 shadow-sm mb-5 gap-2"
          >
            
            <Text className="text-white font-SoraBold text-lg">
            
              Editar Perfil
            </Text>
            <Pencil size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/')}
            className="mt-2 bg-white text-black border border-gray-300 rounded-xl py-4 items-center shadow-md flex-row justify-center gap-2"
          >
            
            <Text className="text-black font-SoraBold text-lg">
              Cerrar Sesión
            </Text>
            <LogOut size={18} color="#991b1b" />    
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Config Modal */}
      <Modal visible={showConfig} animationType="slide" transparent>
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowConfig(false)}
        >
          <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[70%]">
            <Text className="text-xl font-SoraBold text-gray-900 mb-6 text-center">
              Configuración
            </Text>
            
            <View className="space-y-4">
              <TouchableOpacity 
                className="p-4 bg-gray-50 rounded-lg mb-2"
                onPress={() => {
                  setSection('terms');
                  // Implementar navegación a términos y condiciones
                }}
              >
                <Text className="text-gray-800 font-SoraMedium">Términos y Condiciones</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="p-4 bg-gray-50 rounded-lg mb-2"
                onPress={() => {
                  setSection('faq');
                  // Implementar navegación a preguntas frecuentes
                }}
              >
                <Text className="text-gray-800 font-SoraMedium">Preguntas Frecuentes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="p-4 bg-gray-50 rounded-lg"
                onPress={abrirWhatsApp}
              >
                <Text className="text-gray-800 font-SoraMedium">Soporte</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="p-4 bg-red-50 rounded-lg mt-8"
                onPress={darDeBajaCuenta}
              >
                <Text className="text-red-700 font-SoraMedium text-center">
                  Dar de baja mi cuenta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}