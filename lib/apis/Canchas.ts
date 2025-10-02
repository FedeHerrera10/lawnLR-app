import { canchasSchema, HabilitarCanchaForm } from "@/constants/types";
import { isAxiosError } from "axios";
import api from "../apiaxios";
import { getToken } from "../secureStore";

export const getCanchasByDate = async (date: string) =>{
    const token = await getToken(); // ✅ Agregar await
  
    if (!token) throw new Error("Usuario no autenticado");
  
    try {
      const response = await api.get(`api/canchas/obtenerTodasLasCanchasPorFecha?fecha=2025-10-01`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
       if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error; // ✅ Agregar esto para manejar otros errores
    }
}

export const getCanchas = async () =>{
    const token = await getToken(); // ✅ Agregar await
  
    if (!token) throw new Error("Usuario no autenticado");
  
    try {
      const response = await api.get(`api/canchas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = canchasSchema.safeParse(response.data);

      if (result.success) {
        return result.data;
      }
      return [];
     
    } catch (error) {
       if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error; // ✅ Agregar esto para manejar otros errores
    }
}

export const habilitarCancha = async (data: HabilitarCanchaForm) => {
    const token = await getToken(); // ✅ Agregar await
  
    if (!token) throw new Error("Usuario no autenticado");
  
    try {
      const response = await api.post(`api/habilitaciones`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      return response.data;
    } catch (error) {
      console.log(error);
       if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error; // ✅ Agregar esto para manejar otros errores
    }
}


