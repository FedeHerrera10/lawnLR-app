import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { LogOut, Pencil } from "lucide-react-native";
import React, { useState } from "react";
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
} from "react-native";

export default function PerfilScreen() {
  const usuario = {
    usuario: "fherreral12",
    nombre: "Federico",
    apellido: "Herrera",
    documento: "37319074",
    nacimiento: "1995-03-12",
    email: "federico.herrera@outlook.com",
    telefono: "+54 380 456789",
    rol: "Socio",
    fechaAlta: "2024-01-15",
    avatar: "https://i.pravatar.cc/300",
  };

  const [showConfig, setShowConfig] = useState(false);
  const [section, setSection] = useState<"menu" | "terms" | "faq">("menu");

  const abrirWhatsApp = () => {
    const url = "https://wa.me/5493804795097";
    Linking.openURL(url).catch(() =>
      alert("No se pudo abrir WhatsApp en este dispositivo")
    );
  };

  const darDeBajaCuenta = () => {
    alert("⚠️ Esta acción dará de baja tu cuenta. Confirmación pendiente.");
    // Más adelante acá podrías llamar a tu backend para eliminar la cuenta
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-16 ">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-extrabold text-green-700">
            Mi Perfil
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowConfig(true);
              setSection("menu");
            }}
          >
            <Ionicons name="settings-outline" size={28} color="#16a34a" />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View className="items-center mb-8">
          <Image
            source={{ uri: usuario.avatar }}
            className="w-28 h-28 rounded-full border-4 border-green-600 shadow-md"
          />
          <Text className="text-2xl font-bold text-gray-800 mt-4">
            {usuario.nombre} {usuario.apellido}
          </Text>
          <Text className="text-green-800 font-medium">{usuario.rol}</Text>
        </View>

        {/* Info */}
        <View className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Información personal
          </Text>
          <View className="space-y-3">
            <Text className="text-gray-600">
              👤 Usuario: <Text className="font-medium">{usuario.usuario}</Text>
            </Text>
            <Text className="text-gray-600 mt-2">
              📄 Documento: <Text className="font-medium">{usuario.documento}</Text>
            </Text>
            <Text className="text-gray-600 mt-2">
              🎂 Nacimiento:{" "}
              <Text className="font-medium">
                {new Date(usuario.nacimiento).toLocaleDateString("es-AR")}
              </Text>
            </Text>
            <Text className="text-gray-600 mt-2">
              📧 Email: <Text className="font-medium">{usuario.email}</Text>
            </Text>
            <Text className="text-gray-600 mt-2">
              📱 Teléfono: <Text className="font-medium">{usuario.telefono}</Text>
            </Text>
            <Text className="text-gray-600 mt-2">
              🗓 Alta:{" "}
              <Text className="font-medium">
                {new Date(usuario.fechaAlta).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </Text>
          </View>
        </View>

        {/* Acciones */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => router.push("/editar-perfil")}
            className="bg-green-700 py-4 rounded-2xl items-center shadow-md flex-row justify-center gap-2"
          >
            <Text className="text-white text-xl font-semibold">
              Editar Perfil
            </Text>
            <Pencil className="w-2 h-2 text-white font-semibold" color="white" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/")}
            className="bg-red-700 py-4 rounded-2xl items-center shadow-md mt-3 flex-row justify-center gap-2"
          >
            <Text className="text-white text-xl font-bold">
              Cerrar Sesión
            </Text>
            <LogOut className="w-3 h-3 text-white text-bold" color="white" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Configuración */}
      <Modal visible={showConfig} animationType="slide" transparent>
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowConfig(false)}
        >
          <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[70%]">
            {/* Menú principal */}
            {section === "menu" && (
              <>
                <Text className="text-lg font-bold text-gray-800 mb-4 text-center">
                  Configuración
                </Text>

                <TouchableOpacity
                  className="flex-row items-center py-3 border-b border-gray-200"
                  onPress={() => setSection("terms")}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#4A4A4A"
                  />
                  <Text className="ml-3 text-gray-700 text-base">
                    Términos y Condiciones
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center py-3 border-b border-gray-200"
                  onPress={() => setSection("faq")}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={22}
                    color="#4A4A4A"
                  />
                  <Text className="ml-3 text-gray-700 text-base">
                    Preguntas Frecuentes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center py-3 border-b border-gray-200"
                  onPress={abrirWhatsApp}
                >
                  <Ionicons name="logo-whatsapp" size={22} color="green" />
                  <Text className="ml-3 text-green-600 text-base font-semibold">
                    Contactar Soporte
                  </Text>
                </TouchableOpacity>

                {/* ⚠️ Acción destructiva */}
                <TouchableOpacity
                  className="flex-row items-center py-3 mt-4"
                  onPress={darDeBajaCuenta}
                >
                  <Ionicons name="warning-outline" size={22} color="red" />
                  <Text className="ml-3 text-red-500 text-base font-semibold">
                    Dar de baja la cuenta
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowConfig(false)}
                  className="mt-6 bg-gray-200 py-3 rounded-2xl items-center"
                >
                  <Text className="text-gray-700 font-semibold">Cerrar</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Términos y Condiciones */}
            {section === "terms" && (
              <ScrollView>
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Términos y Condiciones
                </Text>
                <Text className="text-gray-600 mb-2">
                  Estos son términos y condiciones genéricos. Al utilizar esta
                  aplicación aceptas:
                </Text>
                <Text className="text-gray-600 mb-1">
                  1. Cumplir las normas del club.
                </Text>
                <Text className="text-gray-600 mb-1">
                  2. Usar la app únicamente para reservar turnos.
                </Text>
                <Text className="text-gray-600 mb-1">
                  3. Respetar horarios y políticas de cancelación.
                </Text>
                <Text className="text-gray-600 mb-1">
                  4. El club se reserva el derecho de modificar horarios y
                  disponibilidad.
                </Text>
                <TouchableOpacity
                  onPress={() => setSection("menu")}
                  className="mt-6 bg-green-600 py-3 rounded-2xl items-center"
                >
                  <Text className="text-white font-semibold">Volver</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {/* Preguntas Frecuentes */}
            {section === "faq" && (
              <ScrollView>
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Preguntas Frecuentes
                </Text>
                <Text className="text-gray-700 mb-2">
                  ❓ ¿Cómo saco un turno?{"\n"}
                  👉 Seleccioná la cancha y el horario disponible desde la
                  pantalla principal, luego confirmá la reserva.
                </Text>
                <Text className="text-gray-700 mb-2">
                  💳 ¿Cuáles son las formas de pago?{"\n"}
                  👉 Actualmente aceptamos pagos vía MercadoPago.
                </Text>
                <Text className="text-gray-700 mb-2">
                  ⏰ ¿Puedo cancelar un turno?{"\n"}
                  👉 Sí, desde la sección Mis reservas.
                </Text>
                <TouchableOpacity
                  onPress={() => setSection("menu")}
                  className="mt-6 bg-green-600 py-3 rounded-2xl items-center"
                >
                  <Text className="text-white font-semibold">Volver</Text>
                  
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}