// components/CustomSafeAreaView.tsx
import React, { ReactNode } from "react";
import { Platform } from "react-native";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

type Props = SafeAreaViewProps & {
  children: ReactNode;
  useTopEdge?: boolean; // si true respeta notch / status bar, si false no aplica padding top
};

export default function CustomSafeAreaView({
  children,
  style,
  ...rest
}: Props) {

  const useTopEdge = Platform.OS === "ios";
  return (
    <SafeAreaView
      edges={useTopEdge ? [] : ["top"]} // aplica top solo si useTopEdge=true
      style={style}
      {...rest}
    >
      {children}
    </SafeAreaView>
  );
}
