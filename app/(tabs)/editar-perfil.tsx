import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditarPerfilScreen() {
  // Datos iniciales hardcodeados
  const [usuario, setUsuario] = useState("fherreral12");
  const [nombre, setNombre] = useState("Federico");
  const [apellido, setApellido] = useState("Herrera");
  const [documento, setDocumento] = useState("37319074");
  const [nacimiento, setNacimiento] = useState("12/03/1995");
  const [email, setEmail] = useState("federico.herrera@outlook.com");
  const [telefono, setTelefono] = useState("+54 380 456789");
  const [password, setPassword] = useState("****");
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/300");

  const handleGuardar = () => {
    Alert.alert(
      "✅ Perfil actualizado",
      `Usuario: ${usuario}\nNombre: ${nombre} ${apellido}\nDocumento: ${documento}\nNacimiento: ${nacimiento}\nEmail: ${email}\nTeléfono: ${telefono}`,
    );
    router.back(); // vuelve al perfil
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <Text className="text-3xl font-extrabold text-green-700 mb-8 text-center">
          Editar Perfil
        </Text>

        {/* Avatar */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: avatar }}
            className="w-28 h-28 rounded-full border-4 border-green-600 shadow-md"
          />
          <TouchableOpacity
            onPress={() => Alert.alert("Subir foto", "Función pendiente")}
            className="mt-3 bg-green-100 px-4 py-2 rounded-full"
          >
            <Text className="text-green-700 font-medium">Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Campos de edición */}
        <View className="bg-white rounded-3xl shadow-md p-6 mb-8 space-y-4">
          <View>
            <Text className="text-sm text-gray-700 mb-1">Usuario</Text>
            <TextInput
              value={usuario}
              onChangeText={setUsuario}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Tu usuario"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-1">Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Tu nombre"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-1">Apellido</Text>
            <TextInput
              value={apellido}
              onChangeText={setApellido}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Tu apellido"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-1">Número de Documento</Text>
            <TextInput
              value={documento}
              onChangeText={setDocumento}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Documento"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-1">Fecha de Nacimiento</Text>
            <TextInput
              value={nacimiento}
              onChangeText={setNacimiento}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="DD/MM/AAAA"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-1">Correo electrónico</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-1">Teléfono</Text>
            <TextInput
              value={telefono}
              onChangeText={setTelefono}
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="+54 ..."
              keyboardType="phone-pad"
            />
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-1">Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="****"
            />
          </View>
        </View>

        {/* Acciones */}
        <View className="space-y-4">
          <TouchableOpacity
            onPress={handleGuardar}
            className="bg-green-600 py-4 rounded-2xl items-center shadow-md"
          >
            <Text className="text-white text-lg font-semibold">
              Guardar cambios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-300 py-4 rounded-2xl items-center shadow-md mt-3"
          >
            <Text className="text-gray-800 text-lg font-semibold">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}