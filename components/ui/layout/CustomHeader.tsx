import React from "react";
import { Text, View } from "react-native";

type HeaderCanchaProps = {
  title: string;
  subtitle?: string;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  containerClassName?: string; // Para customizar estilos si se necesita
  backgroundColor?: string;
};

export default function HeaderCancha({
  title,
  subtitle,
  leftButton,
  rightButton,
  containerClassName = "",
  backgroundColor = "",
}: HeaderCanchaProps) {
  return (
    <View className={`relative  rounded-b-[50px] pb-8 pt-12 px-6 shadow-lg ${containerClassName}`}>
      
      {/* Círculos decorativos */}
      <View className={`absolute w-40 h-40 bg-${backgroundColor}-600 opacity-30 rounded-full -top-10 -left-10`} />
      <View className={`absolute w-32 h-32 bg-${backgroundColor}-600 opacity-20 rounded-full top-0 right-0`} />

      {/* Botón izquierdo */}
      {leftButton && (
        <View className="absolute top-16 left-6 flex items-center justify-center">
          {leftButton}
        </View>
      )}

      {/* Botón derecho */}
      {rightButton && (
        <View className="absolute top-16 right-6 flex items-center justify-center">
          {rightButton}
        </View>
      )}

      {/* Título centrado */}
      <View className="flex-row justify-center items-center">
        <Text className="text-white text-2xl font-SoraBold text-center">{title}</Text>
      </View>

      {/* Subtítulo opcional */}
      {subtitle && (
        <Text className="text-white text-base mt-4 opacity-90 text-center font-SoraMedium">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
