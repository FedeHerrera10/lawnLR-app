import { canchasSchema, HabilitarCanchaForm } from "@/constants/types";
import { isAxiosError } from "axios";
import api from "../apiaxios";
import { getToken } from "../secureStore";

export const getCanchasByDate = async (date: string) =>{
    const token = await getToken(); // ✅ Agregar await
  
    if (!token) throw new Error("Usuario no autenticado");
  
    try {
      const response = await api.get(`api/canchas/obtenerTodasLasCanchasPorFecha?fecha=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     const result = canchasSchema.safeParse(response.data);
     if (result.success) {
       return result.data;
     }
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



export const bloquearHorario = async ({id,data}: {id: number, data: any}) => {
    const token = await getToken(); // ✅ Agregar await
  
    if (!token) throw new Error("Usuario no autenticado");
  
    try {

      const response = await api.put(`/api/canchas/${id}/bloquear`, data, {
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

export const desbloquearHorario = async ({id,data}: {id: number, data: any}) => {
  const token = await getToken(); // ✅ Agregar await

  if (!token) throw new Error("Usuario no autenticado");

  try {

    const response = await api.put(`/api/canchas/${id}/liberar`, data, {
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

export const getDisponibilidades = async ({id,dateInicio,dateFin}: {id: number, dateInicio: string, dateFin: string}) =>{
  const token = await getToken(); // ✅ Agregar await

  if (!token) throw new Error("Usuario no autenticado");
  console.log("id", id);
  console.log("dateInicio", dateInicio);
  console.log("dateFin", dateFin);

  
  try {
    const response = await api.get(`api/canchas/${id}/disponibilidades?desde=${dateInicio}&hasta=${dateFin}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
   return response.data;
  } catch (error) {
     if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error; // ✅ Agregar esto para manejar otros errores
  }
}
