import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CanchaCardProps = {
  nombre: string;
  superficie: string;
  imageId: number;
  onPress?: () => void;
};

const IMAGENES_CANCHA: Record<number, any> = {
  1: require("../../assets/images/1.jpg"),
  2: require("../../assets/images/2.jpg"),
  3: require("../../assets/images/3.jpg"),
  4: require("../../assets/images/4.jpg"),
  5: require("../../assets/images/5.jpg"),
  6: require("../../assets/images/6.jpg"),
  7: require("../../assets/images/1.jpg"),
  8: require("../../assets/images/2.jpg"),
};

export default function CanchaCard({
  nombre,
  superficie,
  imageId,
  onPress,
}: CanchaCardProps) {
  const imageSource = IMAGENES_CANCHA[imageId] || IMAGENES_CANCHA[1];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="rounded-2xl shadow-xl overflow-hidden mb-4"
    >
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        style={{ width: "100%", height: 180 }} // controla tamaño
        imageStyle={{ borderRadius: 16 }} // borde redondeado en la imagen
      >
        {/* Overlay negro */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 16 },
          ]}
        />

        {/* Contenido */}
        <View className="p-4 absolute bottom-0 left-0 right-0">
          <Text className="text-white text-xl font-SoraBold">{nombre}</Text>
          <Text className="text-white text-md mt-1 font-SoraMedium">
            {superficie}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
