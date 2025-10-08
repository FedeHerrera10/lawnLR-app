//  import CustomSafeAreaView from "@/components/ui/layout/CustomSafeAreaView";
// import { ArrowLeftIcon, LogOutIcon } from "lucide-react-native";
// import React from "react";
// import { Text, TouchableOpacity, View } from "react-native";

import LoginScreen from "./auth/login";

  
//  export default function index() {
//    return (
//      <CustomSafeAreaView style={{ flex: 1, backgroundColor: "#166534" }}>
//      <View className="flex-1  bg-black">
//        <View className="flex-1 mb-12 bg-white">
//        <View className="relative bg-green-800 rounded-b-[50px] pb-8 pt-12 px-6 shadow-lg">
      
//          {/* Círculos decorativos */}
//          <View className="absolute w-40 h-40 bg-green-700 opacity-30 rounded-full -top-10 -left-10" />
//          <View className="absolute w-32 h-32 bg-green-700 opacity-20 rounded-full top-0 right-0" />
//          {/* Botón de regreso (izquierda) */}
//          <TouchableOpacity className="absolute top-16 left-6 flex items-center justify-center">
//            <Text className="text-white text-xl font-SemiBold">
//              <ArrowLeftIcon size={24} color="white" />
//            </Text>
//          </TouchableOpacity>
//          {/* Botón de cierre de sesión (derecha) */}
//          <TouchableOpacity className="absolute top-16 right-6 flex items-center justify-center">
//            <Text className="text-white text-xl font-SemiBold">
//              <LogOutIcon size={24} color="white" />
//            </Text>
//          </TouchableOpacity>
//          {/* Contenido del header */}
//          <View className="flex-row justify-center items-center">
//            <Text className="text-white text-2xl font-SemiBold">
//              Administración Canchas
//            </Text>
//          </View>
//          {/* Subtítulo */}
//          <Text className="text-white text-base mt-4 opacity-90 text-center font-SemiBold">
//            Reserva tu cancha fácil y rápido 🎾
//          </Text>
//        </View>
//        </View>
//      </View>
  
//      </CustomSafeAreaView>
//    );
//  }


 export default function index() {
     return (
         <LoginScreen/>
     )
 }