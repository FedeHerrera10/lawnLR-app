import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  icon?: React.ReactNode;
  placeholder?: string;
  editable?: boolean;
  error?: string;
  inputProps?: TextInputProps; // props extra opcionales para el TextInput
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  icon,
  placeholder,
  editable = true,
  error,
  inputProps,
}: FormInputProps<T>) {
  return (
    <>
      {/* Label */}
      <Text className="text-lg text-gray-900 font-SoraExtraBold mb-2">
        {label}
      </Text>

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
              value={value as string}
              editable={editable}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              className="flex-1 px-3 py-2.5 text-xl tracking-tight text-gray-900 font-Sora"
              placeholderTextColor="#6b7280"
              {...inputProps}
            />
          </View>
        )}
      />
      {error && (
        <Text className="text-red-700 text-base mb-2 font-Sora  ">
          {error}
        </Text>
      )}
    </>
  );
}
