// components/CustomTabBar.tsx
import { Href, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

  return (
    <View
      className="flex-row items-center justify-around bg-white border-t border-gray-200 "
      style={{ height: 70 }}
    >
      {state.routes.map((route: any, index: any) => {
        const focused = state.index === index;
        const tab = TABS.find((t: any) => t.name === route.name);
        if (!tab) return null;

        const Icon = tab.icon;
        const routeName = route.name; // ej. "perfil/[id]"
        const id = tab.id;
        const routeDinamic = id
          ? `/(tabs)/${routeName.replace("[id]", id)}`
          : `/(tabs)/${routeName}`;

        return (
          <TouchableOpacity
            key={route.key}
            className="flex-1 items-center justify-center"
            onPress={() => !focused && router.push(routeDinamic as Href)}
          >
            <Icon size={20} color={focused ? "#16a34a" : "#4A4A4A"} />
            <Text
              className={focused ? "text-green-600 mt-1" : "text-gray-600 mt-1"}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
