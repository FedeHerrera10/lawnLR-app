import DateTimePicker from "@react-native-community/datetimepicker";
import { Check, Clock, Plus, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

type DiaSemana =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

interface HorarioProfesor {
  id: string;
  dia: DiaSemana;
  horaInicio: Date;
  horaFin: Date;
}

type HorarioProfesorComponentProps = {
  horariosProfesores: HorarioProfesor[];
  setHorariosProfesores: (horarios: HorarioProfesor[]) => void;
};

const formatearHora = (fecha: Date) => {
  return fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const HorarioProfesorComponent = ({
  horariosProfesores,
  setHorariosProfesores,
}: HorarioProfesorComponentProps) => {
  const [nuevoHorario, setNuevoHorario] = useState<Omit<HorarioProfesor, "id">>(
    {
      dia: "Lunes",
      horaInicio: new Date(0, 0, 0, 15, 0),
      horaFin: new Date(0, 0, 0, 20, 0),
    }
  );
  const [mostrarFormularioHorario, setMostrarFormularioHorario] =
    useState(false);
  const [mostrarHoraInicioProf, setMostrarHoraInicioProf] = useState(false);
  const [mostrarHoraFinProf, setMostrarHoraFinProf] = useState(false);
  const [mostrarDiasModal, setMostrarDiasModal] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState<DiaSemana[]>([]);

  const diasSemana: DiaSemana[] = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const toggleDia = (dia: DiaSemana) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const agregarHorarioProfesor = () => {
    if (diasSeleccionados.length === 0) {
      // Si no hay días seleccionados, agregar solo el día actual
      const nuevoHorarioCompleto = {
        ...nuevoHorario,
        id: Date.now().toString(),
      };
      setHorariosProfesores([...horariosProfesores, nuevoHorarioCompleto]);
    } else {
      // Agregar horario para cada día seleccionado
      const nuevosHorarios = diasSeleccionados.map((dia) => ({
        ...nuevoHorario,
        id: Date.now().toString() + dia,
        dia,
      }));
      setHorariosProfesores([...horariosProfesores, ...nuevosHorarios]);
    }

    setMostrarFormularioHorario(false);
    setNuevoHorario({
      dia: "Lunes",
      horaInicio: new Date(0, 0, 0, 9, 0),
      horaFin: new Date(0, 0, 0, 13, 0),
    });
    setDiasSeleccionados([]);
  };

  const eliminarHorarioProfesor = (id: string) => {
    setHorariosProfesores(horariosProfesores.filter((h) => h.id !== id));
  };

  return (
    <>
      {/* Horarios de Profesores */}
      <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-700 font-SoraBold text-base">
            Horarios de Profesores
          </Text>
          <TouchableOpacity
            className="bg-green-100 p-2 rounded-full"
            onPress={() => setMostrarFormularioHorario(true)}
          >
            <Plus size={20} color="#10B981" />
          </TouchableOpacity>
        </View>

        {horariosProfesores.length > 0 ? (
          <View className="mt-2">
            {horariosProfesores.map((horario) => (
              <View
                key={horario.id}
                className="flex-row justify-between items-center py-2 border-b border-gray-100"
              >
                <View>
                  <Text className="font-SoraMedium">{horario.dia}</Text>
                  <Text className="text-sm text-gray-500 font-SoraMedium">
                    {formatearHora(horario.horaInicio)} -{" "}
                    {formatearHora(horario.horaFin)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => eliminarHorarioProfesor(horario.id)}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500 text-center py-2 font-SoraMedium">
            No hay horarios de profesores agregados
          </Text>
        )}
      </View>

      {/* Modal para agregar horario de profesor */}
      <Modal
        visible={mostrarFormularioHorario}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarFormularioHorario(false)}
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-SoraBold text-gray-900">
                Agregar Horario de Profesor
              </Text>
              <TouchableOpacity
                onPress={() => setMostrarFormularioHorario(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1 font-SoraMedium">
                Días de la semana
              </Text>
              <TouchableOpacity
                className="border border-gray-200 p-3 rounded-lg"
                onPress={() => setMostrarDiasModal(true)}
              >
                <Text className="text-gray-900">
                  {diasSeleccionados.length > 0
                    ? diasSeleccionados.join(", ")
                    : "Seleccionar días"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[48%]">
                <Text className="text-gray-600 mb-1 font-SoraMedium">
                  Hora inicio
                </Text>
                <TouchableOpacity
                  className="border border-gray-200 p-3 rounded-lg flex-row justify-between items-center"
                  onPress={() => setMostrarHoraInicioProf(true)}
                >
                  <Text>{formatearHora(nuevoHorario.horaInicio)}</Text>
                  <Clock size={20} color="#6B7280" />
                </TouchableOpacity>
                {mostrarHoraInicioProf && (
                  <DateTimePicker
                    value={nuevoHorario.horaInicio}
                    mode="time"
                    display="compact"
                    onChange={(event, selectedTime) => {
                      setMostrarHoraInicioProf(false);
                      if (selectedTime) {
                        setNuevoHorario({
                          ...nuevoHorario,
                          horaInicio: selectedTime,
                        });
                      }
                    }}
                  />
                )}
              </View>

              <View className="w-[48%]">
                <Text className="text-gray-600 mb-1 font-SoraMedium">
                  Hora fin
                </Text>
                <TouchableOpacity
                  className="border border-gray-200 p-3 rounded-lg flex-row justify-between items-center"
                  onPress={() => setMostrarHoraFinProf(true)}
                >
                  <Text>{formatearHora(nuevoHorario.horaFin)}</Text>
                  <Clock size={20} color="#6B7280" />
                </TouchableOpacity>
                {mostrarHoraFinProf && (
                  <DateTimePicker
                    value={nuevoHorario.horaFin}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setMostrarHoraFinProf(false);
                      if (selectedTime) {
                        setNuevoHorario({
                          ...nuevoHorario,
                          horaFin: selectedTime,
                        });
                      }
                    }}
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              className="bg-green-600 py-3 rounded-lg items-center mt-2 flex-row justify-center gap-2"
              onPress={agregarHorarioProfesor}
            >
              <Text className="text-white font-SoraBold">Agregar Horario</Text>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar días */}
      <Modal
        visible={mostrarDiasModal}
        transparent
        animationType="slide"
        onRequestClose={() => setMostrarDiasModal(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-2xl p-5 w-full">
            <Text className="text-lg font-semibold mb-3 text-center">
              Seleccionar días
            </Text>

            <ScrollView className="max-h-72">
              {diasSemana.map((dia) => {
                const isSelected = diasSeleccionados.includes(dia);
                return (
                  <TouchableOpacity
                    key={dia}
                    className="flex-row items-center py-2"
                    onPress={() => toggleDia(dia)}
                  >
                    <View
                      className={`w-8 h- rounded-full border border-green-600 
                                            ${
                                              isSelected
                                                ? "bg-green-600"
                                                : "bg-transparent"
                                            }`}
                    >
                      {isSelected && <Check size={16} color="white" />}
                    </View>
                    <Text className="ml-3 text-base">{dia}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              className="bg-green-600 rounded-xl py-3 mt-4 items-center"
              onPress={() => setMostrarDiasModal(false)}
            >
              <Text className="text-white font-semibold">Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
