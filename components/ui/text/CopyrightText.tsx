import { Copyright } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

type CopyrightTextProps = {
  color?: string;
  size?: number;
  textColor?: string;
};

export const CopyrightText = ({
  color,
  size,
  textColor,
}: CopyrightTextProps) => {
  return (
    <View className="items-center mt-6 flex-row gap-2 justify-center">
      <Copyright size={size ?? 20} color={color ?? "white"} />
      <Text className={`text-lg text-${textColor ?? "white"}`}>
        Lawn Tennis LR 2025{" "}
      </Text>
    </View>
  );
};

export default CopyrightText;
