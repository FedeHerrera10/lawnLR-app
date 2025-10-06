import * as SecureStore from 'expo-secure-store';

// Guardar token
export const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync('authToken', token);
    
  } catch (error) {
    console.error('Error al guardar token', error);
  }
};

// Obtener token
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    return token;
  } catch (error) {
    return null;
  }
};

// Eliminar token
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('authToken');
  } catch (error) {
    console.error('Error al eliminar token', error);
    return null;
  }
};


export const userAndPassBiometric = async (user: string, pass: string) => {
  try {
    await SecureStore.setItemAsync('user', user);
    await SecureStore.setItemAsync('pass', pass);
  } catch (error) {
    console.error('Error al guardar user y pass biometric', error);
    return null;
  }
};