import { useAuth } from '@/hooks/useAuth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Check, ChevronDown, Clock, LogOut, Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

interface HorarioProfesor {
  id: string;
  dia: DiaSemana;
  horaInicio: Date;
  horaFin: Date;
}

export default function AdminCanchas() {
  const { signOut } = useAuth();
  const [selectedCancha, setSelectedCancha] = useState<{label: string, value: string} | null>(null);
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
    
    console.log('Configuración de habilitación:', configuracion);
    
    // Aquí iría la llamada a la API para guardar la configuración
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
          <Text className="text-gray-700 font-medium mb-2 text-base">Seleccionar Cancha</Text>
          <TouchableOpacity 
            className="border border-gray-300 bg-white p-4 rounded-xl flex-row justify-between items-center"
            onPress={() => setShowCanchaModal(true)}
          >
            <Text className={`${selectedCancha ? 'text-gray-900' : 'text-gray-400'}`}>
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

        {/* Rango de Fechas */}
        <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <Text className="text-gray-700 font-medium mb-3 text-base">Período de Habilitación</Text>
          
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Fecha de inicio</Text>
            <TouchableOpacity 
              className="border border-gray-200 p-3 rounded-lg flex-row justify-between items-center"
              onPress={() => setMostrarFechaInicio(true)}
            >
              <Text>{fechaInicio.toLocaleDateString()}</Text>
              <Calendar size={20} color="#6B7280" />
            </TouchableOpacity>
            {mostrarFechaInicio && (
              <DateTimePicker
                value={fechaInicio}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setMostrarFechaInicio(false);
                  if (selectedDate) {
                    setFechaInicio(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text>Rango de fechas</Text>
            <Switch
              value={rangoFechas}
              onValueChange={setRangoFechas}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            />
          </View>

          {rangoFechas && (
            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Fecha de fin</Text>
              <TouchableOpacity 
                className="border border-gray-200 p-3 rounded-lg flex-row justify-between items-center"
                onPress={() => setMostrarFechaFin(true)}
              >
                <Text>{fechaFin.toLocaleDateString()}</Text>
                <Calendar size={20} color="#6B7280" />
              </TouchableOpacity>
              {mostrarFechaFin && (
                <DateTimePicker
                  value={fechaFin}
                  mode="date"
                  display="default"
                  minimumDate={fechaInicio}
                  onChange={(event, selectedDate) => {
                    setMostrarFechaFin(false);
                    if (selectedDate) {
                      setFechaFin(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          )}
        </View>

        {/* Horario de Habilitación */}
        <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-700 font-medium text-base">Horario de Habilitación</Text>
            <View className="flex-row items-center">
              <Text className="mr-2 text-sm text-gray-600">Todo el día</Text>
              <Switch
                value={todoElDia}
                onValueChange={setTodoElDia}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              />
            </View>
          </View>
          
          {!todoElDia && (
            <View className="flex-row justify-between">
              <View className="w-[48%]">
                <Text className="text-gray-600 mb-1">Hora inicio</Text>
                <TouchableOpacity 
                  className="border border-gray-200 p-3 rounded-lg flex-row justify-between items-center"
                  onPress={() => setMostrarHoraInicio(true)}
                >
                  <Text>{formatearHora(horaInicio)}</Text>
                  <Clock size={20} color="#6B7280" />
                </TouchableOpacity>
                {mostrarHoraInicio && (
                  <DateTimePicker
                    value={horaInicio}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setMostrarHoraInicio(false);
                      if (selectedTime) {
                        setHoraInicio(selectedTime);
                      }
                    }}
                  />
                )}
              </View>

              <View className="w-[48%]">
                <Text className="text-gray-600 mb-1">Hora fin</Text>
                <TouchableOpacity 
                  className="border border-gray-200 p-3 rounded-lg flex-row justify-between items-center"
                  onPress={() => setMostrarHoraFin(true)}
                >
                  <Text>{formatearHora(horaFin)}</Text>
                  <Clock size={20} color="#6B7280" />
                </TouchableOpacity>
                {mostrarHoraFin && (
                  <DateTimePicker
                    value={horaFin}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setMostrarHoraFin(false);
                      if (selectedTime) {
                        setHoraFin(selectedTime);
                      }
                    }}
                  />
                )}
              </View>
            </View>
          )}
        </View>

        {/* Horarios de Profesores */}
        <View className="mb-6 bg-white p-4 rounded-xl shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-700 font-medium text-base">Horarios de Profesores</Text>
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
                    <Text className="font-medium">{horario.dia}</Text>
                    <Text className="text-sm text-gray-500">
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
            <Text className="text-gray-500 text-center py-2">No hay horarios de profesores agregados</Text>
          )}
        </View>

        {/* Botón de confirmación */}
        <TouchableOpacity 
          className="bg-green-600 py-4 rounded-xl items-center mb-8 shadow-md"
          onPress={handleHabilitarCancha}
          disabled={!selectedCancha || horariosProfesores.length === 0}
        >
          <Text className="text-white font-bold text-lg">
            Habilitar Cancha
          </Text>
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
              <Text className="text-lg font-bold text-gray-900">Seleccionar Cancha</Text>
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
              <Text className="text-lg font-bold text-gray-900">Agregar Horario de Profesor</Text>
              <TouchableOpacity onPress={() => setMostrarFormularioHorario(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Día de la semana</Text>
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
                <Text className="text-gray-600 mb-1">Hora inicio</Text>
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
                <Text className="text-gray-600 mb-1">Hora fin</Text>
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
              className="bg-green-600 py-3 rounded-lg items-center mt-2"
              onPress={agregarHorarioProfesor}
            >
              <Text className="text-white font-medium">Agregar Horario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}