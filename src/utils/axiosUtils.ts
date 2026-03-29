import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "./constantsUtils";
import { useAuthStore } from "../store/useAuthStore";

export function handleApiError(error: unknown): { title: string; description: string } {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: string[] };

    return {
      title: data?.message || "Error desconocido desde el servidor.",
      description: data?.errors?.join(", ") || "Ocurrió un error inesperado.",
    };
  }

  if (error instanceof Error) {
    return {
      title: "Error inesperado",
      description: error.message || "Error inesperado en la solicitud.",
    };
  }

  return {
    title: "Error inesperado",
    description: "Ocurrió un error inesperado.",
  };
}

export const api = (path: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}/${path}`,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      handleAxiosError(error, `llamar a ${path}`);
      return Promise.reject(error);
    }
  );

  return instance;
};

export const handleAxiosError = (error: unknown, action: string): void => {
  if (axios.isAxiosError(error)) {
    console.error(
      `Error del servidor al ${action}:`,
      error.response?.data?.message || "Error desconocido"
    );
  } else if (error instanceof Error) {
    console.error(`Error al ${action}:`, error.message);
  } else {
    console.error(`Error inesperado al ${action}:`, error);
  }
};