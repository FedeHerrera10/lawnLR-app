import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

type CanchaCardProps = {
    nombre: string;
    superficie: string;
    imageId: number; // id para seleccionar la imagen local
    onPress?: () => void;
};

const IMAGENES_CANCHA: Record<number, any> = {
    1: require("../../assets/images/1.jpg"),
    2: require("../../assets/images/2.jpg")
    // agregar más según necesidad
  };


export default function CanchaCard({
  nombre,
  superficie,
  imageId,
  onPress,
}: CanchaCardProps) {
    
    const imageSource = IMAGENES_CANCHA[imageId] || IMAGENES_CANCHA[1]; // fallback
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className=" rounded-2xl shadow-md overflow-hidden mb-4"
    >
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        className="w-full h-52 justify-end"
      >
        {/* Overlay negro semitransparente */}
        <View className="absolute inset-0 bg-black/40 rounded-2xl" />

        {/* Contenido */}
        <View className="p-4">
          <Text className="text-white text-xl font-SoraBold">{nombre}</Text>
          <Text className="text-white/80 text-md mt-1 font-SoraMedium">{superficie}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
