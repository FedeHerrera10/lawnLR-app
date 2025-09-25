import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DateInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  error?: string;
  editable?: boolean;
  // formatea la fecha a string, por defecto DD/MM/YYYY
  formatDate?: (date: Date) => string;
};

export function DateInput<T extends FieldValues>({
  control,
  name,
  label = "Fecha de Nacimiento",
  placeholder = "DD/MM/AAAA",
  error,
  editable = true,
  formatDate = (d) =>
    d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
}: DateInputProps<T>) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDateForSubmit = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
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
        render={({ field: { onChange, value } }) => {
            const dateValue = value && typeof value === 'object' && 'getTime' in value
              ? new Date(value.getTime())
              : value
              ? new Date(value)
              : new Date(2025, 0, 1);

          return (
            <>
              <TouchableOpacity
                disabled={!editable}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.85}
                className={`border ${
                  error ? "border-red-600" : "border-gray-300"
                } rounded-2xl px-4 py-4 mb-2 bg-white`}
              >
                <View className="flex-row items-center">
                  <Calendar size={20} color="#065f46" />
                  <Text className="ml-3 text-lg tracking-tight text-gray-900 font-Sora">
                    {value ? formatDate(dateValue) : placeholder}
                  </Text>
                </View>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                value={dateValue}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                textColor="black"
                accentColor="#16a34a"
                style={styles.picker}
                onChange={(event, selectedDate) => {
                  if (Platform.OS !== "ios") setShowPicker(false);
                  if (selectedDate) {
                    onChange(formatDateForSubmit(selectedDate));
                  }
                }}
              />
              )}

              {Platform.OS === "ios" && showPicker && (
                <View className="flex-row justify-end gap-3 mt-2">
                  <TouchableOpacity
                    className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
                    onPress={() => setShowPicker(false)}
                  >
                    <Text className="text-gray-800 font-Sora">Listo</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          );
        }}
      />

      {error && (
        <Text className="text-red-700 text-base mb-2 font-Sora">{error}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#16a34a",
  },
});
