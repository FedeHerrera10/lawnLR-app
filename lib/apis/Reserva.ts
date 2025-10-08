import { isAxiosError } from "axios";
import api from "../apiaxios";
import { getToken } from "../secureStore";

export const obtenerResumen = async (data : any) => {
    const token = await getToken(); // ✅ Agregar await
  
    if (!token) throw new Error("Usuario no autenticado");
  
    try {
  
      const response = await api.post(`/api/reservas/calcular-precios`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      return response.data || [];
    } catch (error) {
      console.log(error);
       if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error; // ✅ Agregar esto para manejar otros errores
    }
  }