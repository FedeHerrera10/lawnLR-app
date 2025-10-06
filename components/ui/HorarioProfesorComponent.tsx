// components/ui/HorarioProfesorComponent.tsx
import { Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

type HorarioProfesorItem = {
  dia: string; // "MONDAY", "TUESDAY", etc.
  horaInicio: string;
  horaFin: string;
};

type HorarioProfesorComponentProps = {
  horariosProfesores: HorarioProfesorItem[];
  setHorariosProfesores: React.Dispatch<React.SetStateAction<HorarioProfesorItem[]>>;
};

const DIAS_ES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const dayToDTO: Record<string, string> = {
  Lunes: "MONDAY",
  Martes: "TUESDAY",
  Miércoles: "WEDNESDAY",
  Jueves: "THURSDAY",
  Viernes: "FRIDAY",
  Sábado: "SATURDAY",
  Domingo: "SUNDAY",
};

const dayToSpanish: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const generarHoras = () => {
  const horas: string[] = [];
  for (let h = 8; h < 22; h++) {
    horas.push(`${h.toString().padStart(2, "0")}:00`);
  }
  return horas;
};

const BotonSeleccion = ({
  texto,
  seleccionado,
  onPress,
}: {
  texto: string;
  seleccionado: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`py-3 px-1 mx-1 my-1 flex-1 rounded-xl ${
      seleccionado ? "bg-green-600 border-green-700" : "bg-white border-gray-200"
    } border items-center`}
  >
    <Text
      className={`text-sm font-SoraMedium ${
        seleccionado ? "text-white" : "text-gray-700"
      }`}
    >
      {texto}
    </Text>
  </TouchableOpacity>
);

export default function HorarioProfesorComponent({
  horariosProfesores,
  setHorariosProfesores,
}: HorarioProfesorComponentProps) {
  const [mostrarFormularioHorario, setMostrarFormularioHorario] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horasSeleccionadas, setHorasSeleccionadas] = useState<string[]>([]);

  const toggleSeleccion = (
    lista: string[],
    setLista: React.Dispatch<React.SetStateAction<string[]>>,
    valor: string
  ) => {
    setLista((prev) =>
      prev.includes(valor) ? prev.filter((d) => d !== valor) : [...prev, valor]
    );
  };

  const toggleHora = (hora: string) => {
    setHorasSeleccionadas((prev) =>
      prev.includes(hora) ? prev.filter((h) => h !== hora) : [...prev, hora]
    );
  };

  const agregarHorarioProfesor = () => {
    if (diasSeleccionados.length === 0 || horasSeleccionadas.length === 0) return;

    const nuevos = diasSeleccionados.flatMap((diaEs) =>
      horasSeleccionadas.map((hora) => ({
        dia: dayToDTO[diaEs],
        horaInicio: hora,
        horaFin: hora,
      }))
    );

    setHorariosProfesores((prev) => [...prev, ...nuevos]);
    setMostrarFormularioHorario(false);
    
    //setDiasSeleccionados([]);
    //setHorasSeleccionadas([]);
  };

  const eliminarHorario = (index: number) => {
    setHorariosProfesores((prev) => prev.filter((_, i) => i !== index));
  };

  // Agrupar por día los horarios seleccionados
  const horariosAgrupados = horariosProfesores.reduce<Record<string, string[]>>((acc, h) => {
    const dia = dayToSpanish[h.dia];
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(h.horaInicio);
    return acc;
  }, {});

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={() => setMostrarFormularioHorario(true)}
        className="bg-red-600 py-3 rounded-xl flex-row items-center justify-center mb-4"
      >
        <Plus size={18} color="white" />
        <Text className="text-white font-SoraSemiBold ml-2">Agregar horario</Text>
      </TouchableOpacity>

      {/* Lista de horarios agrupados */}
      <View className="bg-white rounded-2xl p-4 shadow-sm">
        {Object.keys(horasSeleccionadas).length === 0 ? (
          <View className="bg-red-50 p-4 rounded-lg border border-red-100">
            <Text className="text-red-800 text-center">
              No hay horarios agregados aún.
            </Text>
          </View>
        ) :
        (
          <View className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <Text className="text-blue-800 text-center">
            Horarios agregados ingrese en horarios para visualizar
          </Text>
        </View>
        )
        }
         
        
      </View>

      {/* Modal para agregar horario */}
      <Modal
        visible={mostrarFormularioHorario}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarFormularioHorario(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-11/12 rounded-2xl p-6 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-SoraBold">Agregar horario de profesores</Text>
              <TouchableOpacity
                onPress={() => setMostrarFormularioHorario(false)}
                className="p-2 -mr-2"
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Días */}
            <View className="mb-6">
              <Text className="text-gray-700 font-SoraMedium mb-2">Días</Text>
              <FlatList
                data={DIAS_ES}
                numColumns={3}
                keyExtractor={(d) => d}
                contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                  <View style={{ flex: 1, maxWidth: "33.33%" }}>
                    <BotonSeleccion
                      texto={item}
                      seleccionado={diasSeleccionados.includes(item)}
                      onPress={() =>
                        toggleSeleccion(diasSeleccionados, setDiasSeleccionados, item)
                      }
                    />
                  </View>
                )}
              />
            </View>

            {/* Horas */}
            <View className="mb-6 pt-4 border-t border-gray-100">
              <Text className="text-gray-700 font-SoraMedium mb-2">Horas</Text>
              <FlatList
                data={generarHoras()}
                numColumns={3}
                keyExtractor={(hora) => hora}
                contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item: hora }) => (
                  <View style={{ flex: 1, maxWidth: "33.33%" }}>
                    <BotonSeleccion
                      texto={hora}
                      seleccionado={horasSeleccionadas.includes(hora)}
                      onPress={() => toggleHora(hora)}
                    />
                  </View>
                )}
              />
            </View>

            {/* Botones acción */}
            <View className="flex-row w-full gap-3 mt-4">
              <TouchableOpacity
                onPress={() => setMostrarFormularioHorario(false)}
                className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
              >
                <Text className="text-gray-700 font-SoraMedium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={agregarHorarioProfesor}
                className={`flex-1 py-3 rounded-xl items-center ${
                  diasSeleccionados.length > 0 && horasSeleccionadas.length > 0
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
                disabled={diasSeleccionados.length === 0 || horasSeleccionadas.length === 0}
              >
                <Text className="text-white font-SoraSemiBold">Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
