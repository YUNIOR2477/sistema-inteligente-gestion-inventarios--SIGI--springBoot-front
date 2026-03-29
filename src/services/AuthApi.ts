import { AxiosError } from "axios";
import type { UserLogin } from "../types/User";
import { api, handleApiError } from "../utils/axiosUtils";
import type { ApiResponse } from "@/types/Response";

const authApi = api("auth");


export const login = async (user: UserLogin): Promise<ApiResponse<string>> => {
    try {
        const response = await authApi.post<ApiResponse<string>>("/login", user);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        console.error("Error al iniciar sesión:", handleApiError(err));
        throw err;
    }
};