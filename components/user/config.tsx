  
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { Linking, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ConfigModal( { showConfig, setShowConfig }: { showConfig: boolean; setShowConfig: (value: boolean) => void } ) {

    
    const [section, setSection] = useState<'menu' | 'terms' | 'faq'>('menu');

    const darDeBajaCuenta = () => {
        alert(' Esta acción dará de baja tu cuenta. Confirmación pendiente.');
      };
    
      const abrirWhatsApp = () => {
        const url = 'https://wa.me/5493804795097';
        Linking.openURL(url).catch(() =>
          alert('No se pudo abrir WhatsApp en este dispositivo')
        );
      };  
      
      const handleBackdropPress = () => {
        setShowConfig(false);
      };
    return (
     
         
      <Modal visible={showConfig} animationType="slide" transparent>
      <Pressable
        className="flex-1 bg-black/50"
        onPress={handleBackdropPress}
      >
        <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[70%]">
          {section === 'menu' ? (
            <>
              <Text className="text-xl font-SoraBold text-gray-900 mb-6 text-center">
                Configuración
              </Text>
              <View className="space-y-4">
                <TouchableOpacity 
                  className="p-4 bg-gray-50 rounded-lg mb-2"
                  onPress={() => setSection('terms')}
                >
                  <Text className="text-gray-800 font-SoraMedium">Términos y Condiciones</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className="p-4 bg-gray-50 rounded-lg mb-2"
                  onPress={() => setSection('faq')}
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
            </>
          ) : (
            <View className="flex-1">
              <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => setSection('menu')} className="mr-4">
                  <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-SoraBold text-gray-900">
                  {section === 'terms' ? 'Términos y Condiciones' : 'Preguntas Frecuentes'}
                </Text>
              </View>
              
              <ScrollView className="flex-1">
                {section === 'terms' ? (
                  <View className="pb-6">
                    <Text className="text-base text-gray-800 mb-4">     
                      Última actualización: 23 de Septiembre de 2024
                    </Text>
                    <Text className="text-gray-700 mb-4">
                      Bienvenido a nuestra aplicación. Al acceder y utilizar nuestros servicios, aceptas cumplir con estos términos y condiciones.
                    </Text>
                    <Text className="text-lg font-SoraBold text-gray-900 mb-2">1. Uso del Servicio</Text>
                    <Text className="text-gray-700 mb-4">
                      Nuestra aplicación está diseñada para proporcionarte información y servicios relacionados con [descripción del servicio].
                    </Text>
                    <Text className="text-lg font-SoraBold text-gray-900 mb-2">2. Privacidad</Text>
                    <Text className="text-gray-700 mb-4">
                      Respetamos tu privacidad y protegemos tus datos personales de acuerdo con nuestra Política de Privacidad.
                    </Text>
                    <Text className="text-lg font-SoraBold text-gray-900 mb-2">3. Responsabilidades</Text>
                    <Text className="text-gray-700">
                      Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, y de restringir el acceso a tu dispositivo.
                    </Text>
                  </View>
                ) : (
                  <View className="pb-6">
                    <Text className="text-lg font-SoraBold text-gray-900 mb-2">¿Cómo actualizo mi perfil?</Text>
                    <Text className="text-gray-700 mb-4">
                      Puedes actualizar tu perfil en cualquier momento desde la sección &quot;Editar Perfil&quot; en la pantalla principal de tu cuenta.
                    </Text>
                    
                    <Text className="text-lg font-SoraBold text-gray-900 mb-2">¿Cómo contacto al soporte?</Text>
                    <Text className="text-gray-700 mb-4">
                      Puedes contactar a nuestro equipo de soporte a través del botón de &quot;Soporte&quot; en la configuración o enviando un correo a soporte@ejemplo.com
                    </Text>
                    
                    <Text className="text-lg font-SoraBold text-gray-900 mb-2">¿Cómo cierro mi sesión?</Text>
                    <Text className="text-gray-700 mb-4">
                      Para cerrar sesión, ve a la pantalla de perfil y selecciona &quot;Cerrar Sesión&quot; en la parte inferior.
                    </Text>
                    
                    <Text className="text-lg font-SoraBold text-gray-900 mb-2">¿Qué hago si olvidé mi contraseña?</Text>
                    <Text className="text-gray-700">
                      En la pantalla de inicio de sesión, selecciona &quot;¿Olvidaste tu contraseña?&quot; y sigue las instrucciones para restablecerla.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </Pressable>
    </Modal>    

    )

}