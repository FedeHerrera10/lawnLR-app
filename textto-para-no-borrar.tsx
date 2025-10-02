import { useAuth } from '@/hooks/useAuth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { ArrowLeft, Check, ChevronDown, Clock, LogOut, Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

interface HorarioProfesor {
  id: string;
  dia: DiaSemana;
  horaInicio: Date;
  horaFin: Date;
}

interface Cancha {
  label: string;
  value: string;
  tipo: string;
}

export default function AdminCanchas() {
  const { signOut } = useAuth();
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [showCanchaModal, setShowCanchaModal] = useState(false);
  
  // Estado para el rango de habilitación
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFin, setHoraFin] = useState(new Date());
  
  // Estado para los horarios de profesores
  const [horariosProfesores, setHorariosProfesores] = useState<HorarioProfesor[]>([]);
  const [nuevoHorario, setNuevoHorario] = useState<Omit<HorarioProfesor, 'id'>>({ 
    dia: 'Lunes',
    horaInicio: new Date(0, 0, 0, 9, 0), // 09:00
    horaFin: new Date(0, 0, 0, 13, 0)   // 13:00
  });
  const [mostrarFormularioHorario, setMostrarFormularioHorario] = useState(false);
  
  // Estados para los pickers
  const [mostrarFechaInicio, setMostrarFechaInicio] = useState(false);
  const [mostrarFechaFin, setMostrarFechaFin] = useState(false);
  const [mostrarHoraInicio, setMostrarHoraInicio] = useState(false);
  const [mostrarHoraFin, setMostrarHoraFin] = useState(false);
  const [mostrarHoraInicioProf, setMostrarHoraInicioProf] = useState(false);
  const [mostrarHoraFinProf, setMostrarHoraFinProf] = useState(false);
  
  const [todoElDia, setTodoElDia] = useState(false);
  const [rangoFechas, setRangoFechas] = useState(false);

  // Lista de canchas disponibles
  const canchas = [
    { label: 'Cancha 1', value: 'cancha1', tipo: 'Tenis Polvo Ladrillo' },
    { label: 'Cancha 2', value: 'cancha2', tipo: 'Tenis Polvo Ladrillo' },
    { label: 'Cancha 3', value: 'cancha3', tipo: 'Tenis Polvo Ladrillo' },
    { label: 'Cancha 4', value: 'cancha4', tipo: 'Tenis Polvo Ladrillo' },
    { label: 'Cancha 5', value: 'cancha5', tipo: 'Tenis Polvo Ladrillo' },
    { label: 'Cancha 6', value: 'cancha6', tipo: 'Tenis Polvo Ladrillo' },
    { label: 'Cancha 7', value: 'cancha7', tipo: 'Tenis Polvo Ladrillo' },
    { label: 'Cancha 8', value: 'cancha8', tipo: 'Tenis Cemento' },
  ];

  // Agrupar canchas por tipo
  const canchasAgrupadas = canchas.reduce((acc, cancha) => {
    if (!acc[cancha.tipo]) {
      acc[cancha.tipo] = [];
    }
    acc[cancha.tipo].push(cancha);
    return acc;
  }, {} as Record<string, typeof canchas>);

  const handleHabilitarCancha = () => {
    if (!selectedCancha) return;
    
    const configuracion = {
      cancha: selectedCancha,
      habilitacion: {
        fechaInicio,
        fechaFin: rangoFechas ? fechaFin : fechaInicio,
        horaInicio: todoElDia ? null : horaInicio,
        horaFin: todoElDia ? null : horaFin,
        todoElDia,
      },
      excepcionesProfesores: horariosProfesores
    };
    
    console.log(configuracion);
    alert(`Cancha ${selectedCancha.label} habilitada exitosamente`);
  };

  const agregarHorarioProfesor = () => {
    const nuevoHorarioCompleto = {
      ...nuevoHorario,
      id: Date.now().toString(),
    };
    
    setHorariosProfesores([...horariosProfesores, nuevoHorarioCompleto]);
    setNuevoHorario({
      dia: 'Lunes',
      horaInicio: new Date(0, 0, 0, 9, 0),
      horaFin: new Date(0, 0, 0, 13, 0)
    });
    setMostrarFormularioHorario(false);
  };

  const eliminarHorarioProfesor = (id: string) => {
    setHorariosProfesores(horariosProfesores.filter(h => h.id !== id));
  };

  const diasSemana: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const meses = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
  ];

  const [visible, setVisible] = useState(false);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const toggleMes = (mes: string) => {
    setSeleccionados((prev) =>
      prev.includes(mes) ? prev.filter((m) => m !== mes) : [...prev, mes]
    );
  };
  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 font-Sora">
      {/* Header */}
      <View className="bg-red-700 px-6 py-8 rounded-b-3xl shadow-md flex-row items-center justify-between">
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()}>
          <ArrowLeft size={22} color="white" style={{ marginTop: 32 }} />
        </TouchableOpacity>
        <Text className="text-white mt-10 text-2xl font-bold text-center font-Sora">
          Habilitación de Canchas
        </Text>
        <TouchableOpacity onPress={signOut}>
          <LogOut size={22} color="white" style={{ marginTop: 32 }} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Selector de Cancha */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2 text-base font-SoraBold">Seleccionar Cancha</Text>
          <TouchableOpacity 
            className="border border-gray-300 bg-white p-4 rounded-xl flex-row justify-between items-center "
            onPress={() => setShowCanchaModal(true)}
          >
            <Text className={`${selectedCancha ? 'text-gray-900 font-SoraMedium' : 'text-gray-400 font-SoraMedium'}`}>
              {selectedCancha ? `${selectedCancha.label} - ${selectedCancha.tipo}` : 'Seleccione una cancha...'}
            </Text>
            <ChevronDown size={20} color="#6B7280" />
          </TouchableOpacity>
          {selectedCancha && (
            <TouchableOpacity 
              className="absolute right-10 top-10 p-2"
              onPress={() => setSelectedCancha(null)}
            >
              <X size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        {/*Fecha*/}
        
        <View >
  <Text>Selecciona el mes:</Text>
  <View className="mt-5">
      {/* Botón para abrir el modal */}
      <TouchableOpacity
        className="bg-green-600 px-4 py-3 rounded-xl items-center"
        onPress={() => setVisible(true)}
      >
        <Text className="text-white font-semibold">Seleccionar meses</Text>
      </TouchableOpacity>

      {/* Chips con meses seleccionados */}
      <View className="flex-row flex-wrap my-6">
        {seleccionados.length === 0 ? (
          <Text className="text-gray-500">Ningún mes seleccionado</Text>
        ) : (
          seleccionados.map((mes) => (
            <View
              key={mes}
              className="bg-slate-600 rounded-xl px-3 py-1 mr-2 mb-2"
            >
              <Text className="text-white">{mes}</Text>
            </View>
          ))
        )}
      </View>

      {/* Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-2xl p-5 w-4/5">
            <Text className="text-lg font-semibold mb-3 text-center">
              Elige los meses
            </Text>

            <ScrollView className="max-h-72">
              {meses.map((mes) => {
                const isSelected = seleccionados.includes(mes);
                return (
                  <TouchableOpacity
                    key={mes}
                    className="flex-row items-center py-2"
                    onPress={() => toggleMes(mes)}
                  >
                    <View
                      className={`w-5 h-5 rounded border border-green-600 
                      ${isSelected ? 'bg-green-600' : 'bg-transparent'}`}
                    />
                    <Text className="ml-3 text-base">{mes}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              className="bg-green-600 rounded-xl py-3 mt-4 items-center"
              onPress={() => setVisible(false)}
            >
              <Text className="text-white font-semibold">Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
</View>
        {/* Horario de Habilitación */}
        <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row  items-center mb-3">
            <Text className="text-gray-700 font-SoraBold text-base mr-2">Horario de Habilitación </Text>
            <Clock size={16} color="#6B7280" />
            
          </View>
          
          
            <View className="flex-row justify-between">
              <View className="w-[48%]">
              <Text className="text-gray-600 mb-1 font-SoraMedium flex-row items-center justify-center">Hora fin</Text>
                <Text>{"08:00 hs."}</Text>
              </View>

              <View className="w-[48%]">
                <Text className="text-gray-600 mb-1 font-SoraMedium">Hora fin</Text>
                <Text>{"23:00 hs."}</Text>
              </View>
            </View>
          
        </View>

        {/* Horarios de Profesores */}
        <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-700 font-SoraBold text-base">Horarios de Profesores</Text>
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
                <View key={horario.id} className="flex-row justify-between items-center py-2 border-b border-gray-100">
                  <View>
                    <Text className="font-SoraMedium">{horario.dia}</Text>
                    <Text className="text-sm text-gray-500 font-SoraMedium">
                      {formatearHora(horario.horaInicio)} - {formatearHora(horario.horaFin)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => eliminarHorarioProfesor(horario.id)}>
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-500 text-center py-2 font-SoraMedium">No hay horarios de profesores agregados</Text>
          )}
        </View>

        {/* Botón de confirmación */}
        <TouchableOpacity 
          className="bg-green-600 py-4 rounded-xl items-center mb-8 shadow-md flex-row justify-center gap-2"
          onPress={handleHabilitarCancha}
          disabled={!selectedCancha || horariosProfesores.length === 0}
        >
          <Text className="text-white font-SoraBold text-lg">
            Habilitar Cancha
          </Text>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de selección de cancha */}
      <Modal
        visible={showCanchaModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCanchaModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={() => setShowCanchaModal(false)}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>
          
          <View className="bg-white rounded-t-3xl max-h-[80%] overflow-hidden">
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-SoraBold text-gray-900">Seleccionar Cancha</Text>
              <TouchableOpacity onPress={() => setShowCanchaModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={Object.entries(canchasAgrupadas)}
              keyExtractor={([tipo]) => tipo}
              renderItem={({ item: [tipo, items] }) => (
                <View key={tipo} className="mb-2">
                  <Text className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">{tipo}</Text>
                  {items.map(cancha => (
                    <TouchableOpacity
                      key={cancha.value}
                      className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${selectedCancha?.value === cancha.value ? 'bg-green-50' : ''}`}
                      onPress={() => {
                        setSelectedCancha(cancha);
                        setShowCanchaModal(false);
                      }}
                    >
                      <View>
                        <Text className="font-medium text-gray-900">{cancha.label}</Text>
                        <Text className="text-sm text-gray-500">{cancha.tipo}</Text>
                      </View>
                      {selectedCancha?.value === cancha.value && (
                        <Check size={20} color="#10B981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

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
              <Text className="text-lg font-SoraBold text-gray-900">Agregar Horario de Profesor</Text>
              <TouchableOpacity onPress={() => setMostrarFormularioHorario(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-600 mb-1 font-SoraMedium">Día de la semana</Text>
              <View className="border border-gray-200 rounded-lg p-2">
                <RNPickerSelect
                  onValueChange={(value) => setNuevoHorario({...nuevoHorario, dia: value})}
                  items={diasSemana.map(dia => ({label: dia, value: dia}))}
                  value={nuevoHorario.dia}
                  style={{
                    inputIOS: {
                      fontSize: 16,
                      paddingVertical: 8,
                      color: '#1F2937',
                    },
                    inputAndroid: {
                      fontSize: 16,
                      paddingVertical: 8,
                      color: '#1F2937',
                    },
                    placeholder: {
                      color: '#9CA3AF',
                    },
                  }}
                />
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[48%]">
                <Text className="text-gray-600 mb-1 font-SoraMedium">Hora inicio</Text>
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
                    display="default"
                    onChange={(event, selectedTime) => {
                      setMostrarHoraInicioProf(false);
                      if (selectedTime) {
                        setNuevoHorario({...nuevoHorario, horaInicio: selectedTime});
                      }
                    }}
                  />
                )}
              </View>

              <View className="w-[48%]">
                <Text className="text-gray-600 mb-1 font-SoraMedium">Hora fin</Text>
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
                        setNuevoHorario({...nuevoHorario, horaFin: selectedTime});
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
    </SafeAreaView>
  );
}