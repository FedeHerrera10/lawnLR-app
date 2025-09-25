import { userResponse, UserUpdate } from "@/constants/types";
import { isAxiosError } from "axios";
import api from "../apiaxios";
import { getToken } from "../secureStore";

export const getUserLogged = async () => {
  const token = await getToken(); // ✅ Agregar await

  if (!token) throw new Error("Usuario no autenticado");

  try {
    const response = await api.get("/api/user/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const plainUser = JSON.parse(JSON.stringify(response.data));
    return plainUser;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error; // ✅ Agregar esto para manejar otros errores
  }
};

export const getUserById = async (id: string) => {
  const token = await getToken(); // ✅ Agregar await

  if (!token) throw new Error("Usuario no autenticado");

  try {
    const response = await api.get(`/api/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = userResponse.safeParse(response.data);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error; // ✅ Agregar esto para manejar otros errores
  }
};

export const updateUser = async ({id, data}: {id: string, data: UserUpdate}) => {
  const token = await getToken(); // ✅ Agregar await

  if (!token) throw new Error("Usuario no autenticado");

  try {
    const response = await api.put(`/api/user/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = userResponse.safeParse(response.data);
    if (!result.success) {
      throw new Error(result.error.message);
    }
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error; // ✅ Agregar esto para manejar otros errores
  }
};

