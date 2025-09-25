import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

type NumericInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  editable?: boolean;
  error?: string;
  icon?: React.ReactNode;
  inputProps?: TextInputProps; // props adicionales si necesitás
};

export function NumericInput<T extends FieldValues>({
  control,
  name,
  label ,
  placeholder ,
  editable = true,
  error,
  icon,
  inputProps,
}: NumericInputProps<T>) {
  return (
    <>
      {label && (
        <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            className={`border ${
              error ? "border-red-600" : "border-gray-300"
            } rounded-2xl px-4 py-2 mb-2 bg-white flex-row items-center`}
          >
            {icon}
            <TextInput
              value={value ? value.toString() : ""}
              editable={editable}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              keyboardType="numeric"
              className="flex-1 px-3 py-2.5 text-lg tracking-tight text-gray-900 font-Sora"
              placeholderTextColor="#6b7280"
              {...inputProps}
            />
          </View>
        )}
      />

      {error && (
        <Text className="text-red-700 text-base mb-2 font-Sora">
          {error}
        </Text>
      )}
    </>
  );
}
