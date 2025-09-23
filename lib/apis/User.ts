import { isAxiosError } from "axios";
import api from "../apiaxios";
import { getToken } from "../secureStore";

export const getUserLogged = async () => {
    const token = await getToken(); // ✅ Agregar await
    console.log("token", token)
    if (!token) throw new Error("Usuario no autenticado");
    
    try {
      console.log("token", token)
      const response = await api.get("/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("response", response)
      const plainUser = JSON.parse(JSON.stringify(response.data));
      return plainUser
    } catch (error) {
      console.log('ERROR', error)
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw error; // ✅ Agregar esto para manejar otros errores
    }
  };
