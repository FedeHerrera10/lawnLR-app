import { changePasswordRequest, LoginProps, User } from "@/constants/types";
import { isAxiosError } from "axios";
import api from "../apiaxios";

export const loginRequest = async (data: LoginProps) => {
  try {
    const response = await api.post("/login", data);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.log("error", error.response.data);
      throw error.response.data;
    }
  }
};

export const createUserRequest = async (data: User) => {
  try {
    const response = await api.post("/api/user/register", data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.log(error.response.data);
      throw error.response.data;
    }
  }
};

type ConfirmAccountProps = {
  token: string;
};
export const confirmAccountRequest = async (data: ConfirmAccountProps) => {
  try {
    const response = await api.put(`/api/auth/confirm-account/${data.token}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
  }
};

type ResendCodeProps = {
  email: string;
};

export const resendCode = async (data: ResendCodeProps) => {
  try {
    const response = await api.post("/api/auth/new-code", data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
  }
};

export const resendCodeChangePassword = async (data: ResendCodeProps) => {
  try {
    const response = await api.post("/api/auth/new-code-for-change-password", data);
    return response.data;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
  }
};


export const passwordResetRequest = async (data: changePasswordRequest) => {
  try {
    const response = await api.put("/api/auth/reset-password", data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }
  }
};