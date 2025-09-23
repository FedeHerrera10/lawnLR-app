import * as SecureStore from 'expo-secure-store';

// Guardar token
export const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync('authToken', token);
    console.log('Token guardado ✅');
  } catch (error) {
    console.error('Error al guardar token', error);
  }
};

// Obtener token
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    console.log('Token obtenido:', token);
    return token;
  } catch (error) {
    console.error('Error al obtener token', error);
    return null;
  }
};

// Eliminar token
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('authToken');
    console.log('Token eliminado ✅');
  } catch (error) {
    console.error('Error al eliminar token', error);
  }
};
