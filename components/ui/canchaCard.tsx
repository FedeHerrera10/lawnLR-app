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
      className="rounded-3xl shadow-2xl overflow-hidden mb-6 bg-white"
    >
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        style={{ width: "100%", height: 180 }}
        imageStyle={{ borderRadius: 24 }}
      >
        {/* Overlay sutil para mejorar legibilidad */}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: 24,
              backgroundColor: "rgba(0,0,0,0.35)",
            },
          ]}
        />

        {/* Badge de superficie */}
        <View className="absolute top-4 right-4 bg-green-800 px-4 py-2 rounded-full shadow-md">
          <Text className="text-white text-sm font-semibold">{superficie}</Text>
        </View>

        {/* Contenido */}
        <View className="p-4 absolute bottom-0   left-4 right-4">
          <Text
            className="text-white text-2xl font-SoraBold mb-1"
            style={{
              textShadowColor: "rgba(0,0,0,0.8)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            {nombre}
          </Text>
          
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
