// components/CustomTabBar.tsx
import { Href, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function CustomTabBar({
  state,
  isUser,
  TABS,
}: {
  state: any;
  isUser: boolean;
  TABS: any;
}) {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Animación de flotación constante (sube y baja suavemente)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-row items-center justify-around bg-gray-50 border-t border-gray-100 shadow-lg shadow-black/10  px-2">
      {state.routes.map((route: any, index: any) => {
        const focused = state.index === index;
        const tab = TABS.find((t: any) => t.name === route.name);
        if (!tab) return null;

        const Icon = tab.icon;
        const routeName = route.name;
        const id = tab.id;
        const routeDinamic = id
          ? `/(tabs)/${routeName.replace("[id]", id)}`
          : `/(tabs)/${routeName}`;

        const iconContainerStyle = focused
          ? isUser
            ? "bg-green-100 rounded-full"
            : "bg-red-100 rounded-full"
          : "bg-transparent";

        const textStyle = focused
          ? isUser
            ? "text-green-700"
            : "text-red-700"
          : "text-gray-500";

        const iconColor = focused
          ? isUser
            ? "#16a34a"
            : "#b91c1c"
          : "#6b7280";

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.8}
            className="flex-1 items-center justify-center py-2"
            onPress={() => !focused && router.push(routeDinamic as Href)}
          >
            <View className="items-center justify-center relative">
              {/* Pelotita flotante visible solo en el tab activo */}
              {focused && (
                <Animated.View
                  style={{
                    transform: [{ translateY: floatAnim }],
                  }}
                  className="absolute -top-4 w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-300 shadow-md shadow-yellow-500/40"
                />
              )}

              <View
                className={`w-10 h-10 items-center justify-center rounded-2xl transition-all duration-200 ${iconContainerStyle}`}
              >
                <Icon size={22} color={iconColor} />
              </View>

              <Text className={`mt-1 text-xs font-SoraMedium ${textStyle}`}>
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
