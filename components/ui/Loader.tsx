// TennisBallLoader.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function TennisBallLoader() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -50,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="flex-1 bg-white">
    <View className="font-Sora items-center justify-center bg-gray-300/90 h-[95%] mb-2 ">
      <Animated.View
        style={[
          styles.ball,
          {
            transform: [{ translateY: bounceAnim }, { rotate }],
          },
        ]}
      >
        <View style={[styles.curve, styles.curveLeft]} />
        <View style={[styles.curve, styles.curveRight]} />
      </Animated.View>
      <Text  className="text-gray-500 font-SoraSemiBold text-center text-md">Espera un momento...</Text>
      
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
 
  ball: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#f5de50",
    borderWidth: 2,
    borderColor: "#f5de50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, // espacio entre pelota y texto
  },
  curve: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: "white",
    borderWidth: 3,
  },
  curveLeft: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    transform: [{ rotate: "-30deg" }, { translateX: -5 }],
  },
  curveRight: {
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "30deg" }, { translateX: 5 }],
  },
  text: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
});
