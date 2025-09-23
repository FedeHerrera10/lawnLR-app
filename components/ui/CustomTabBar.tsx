// components/CustomTabBar.tsx
import { Href, useRouter } from "expo-router";
import { Calendar, User } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const TABSUSER = [
  { name: "user-home", label: "Reserva", icon: Calendar },
  { name: "mis-reservas", label: "Mis Reservas", icon: Calendar },
  { name: "perfil", label: "Perfil", icon: User },
  { name: "admincanchas", label: "Canchas", icon: Calendar },
  
];

const TABSADMIN = [ 
  { name: "administracion", label: "Administracion", icon: Calendar },
  { name: "admin-reservas", label: "Reserva", icon: Calendar },
  { name: "perfil", label: "Perfil", icon: User },
  { name: "admincanchas", label: "Canchas", icon: Calendar },
];

export default function CustomTabBar({ state , isUser}: {state: any, isUser: boolean}) {
  const router = useRouter();
  const TABS = isUser ? TABSUSER : TABSADMIN;
  console.log(state.routes)
  return (
    <View
      className="flex-row items-center justify-around bg-white border-t border-gray-200 "
      style={{ height: 70}}
    >
      {state.routes.map((route: any, index: any) => {
        const focused = state.index === index;
        const tab = TABS.find((t: any) => t.name === route.name);
        if (!tab) return null;

        const Icon = tab.icon;
        const routeName = `${route.name}`;
        
        return (
          <TouchableOpacity
            key={route.key}
            className="flex-1 items-center justify-center"
            onPress={() => !focused && router.push(routeName as Href)}
          >
            <Icon size={20} color={focused ? "#16a34a" : "#4A4A4A"} />
            <Text className={focused ? "text-green-600 mt-1" : "text-gray-600 mt-1"}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
