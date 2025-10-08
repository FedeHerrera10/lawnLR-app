import { Cancha } from '@/constants/types'
import { Check, FlagTriangleLeft } from 'lucide-react-native'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'


type Props = {
  data: Cancha[]
  selectedCancha: Cancha | null
  setSelectedCancha: (cancha: Cancha) => void
  setShowCanchaModal: (show: boolean) => void
}

export const FlatListCanchas = ( { data, selectedCancha, setSelectedCancha, setShowCanchaModal } : Props ) => {
  
    return (
    <FlatList  
  data={data}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item: cancha }) => (
    <TouchableOpacity
      key={cancha.id}
      className={`p-4 border-b border-gray-100 flex-row items-center justify-between ${
        selectedCancha?.id === cancha.id ? "bg-green-50" : ""
      }`}
      onPress={() => {
        setSelectedCancha(cancha);
        setShowCanchaModal(false);
      }}
    >
      <View>
        <Text className="font-medium text-gray-900">
        <FlagTriangleLeft size={16} color="#12B981" strokeWidth={2} />  {cancha.nombre}
        </Text>
        <Text className="font-medium text-sm text-gray-400 ml-3 mt-1">
          Polvo ladrillo
        </Text>
        
      </View>
      {selectedCancha?.id === cancha.id && (
        <Check size={20} color="#10B981" />
      )}
    </TouchableOpacity>
  )}
  contentContainerStyle={{ paddingBottom: 20 }}
  showsVerticalScrollIndicator={false}
/>
  )
}
