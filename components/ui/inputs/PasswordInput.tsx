import { Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type PasswordInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  editable?: boolean;
  error?: string;
  inputProps?: TextInputProps;
};

export function PasswordInput<T extends FieldValues>({
  control,
  name,
  label = "Contraseña",
  editable = true,
  error,
  inputProps,
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {label && (
        <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">
          {label}
        </Text>
      )}

      <View
        className={`border ${
          error ? "border-red-600" : "border-gray-300"
        } rounded-2xl px-4 py-2 mb-2 bg-white flex-row items-center`}
      >
        <Lock size={20} color="#065f46" />
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value as string}
              editable={editable}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#6b7280"
              className="flex-1 px-2 py-2.5 text-xl tracking-tight text-gray-900 font-Sora"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              {...inputProps}
            />
          )}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          activeOpacity={0.8}
        >
          {showPassword ? (
            <EyeOff size={20} color="#065f46" />
          ) : (
            <Eye size={20} color="#065f46" />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <Text className="text-red-700 text-base mb-2 font-Sora">
          {error}
        </Text>
      )}
    </>
  );
}
