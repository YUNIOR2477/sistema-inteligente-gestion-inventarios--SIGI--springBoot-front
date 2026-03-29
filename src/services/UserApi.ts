import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import type { Metrics, NewUser, UpdateUser, User } from "../types/User";
import { api, handleApiError } from "../utils/axiosUtils";

const userApi = api("users");

export const createUser = async (newUser: NewUser): Promise<ApiResponse<User>> => {
    try {
        const response = await userApi.post<ApiResponse<User>>("", newUser);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateUser = async (userId: string, newUser: NewUser): Promise<ApiResponse<User>> => {
    try {
        const response = await userApi.put<ApiResponse<User>>(`/${userId}`, newUser);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deactivateUser = async (userId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await userApi.delete<ApiResponse<void>>(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const activateUser = async (userId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await userApi.put<ApiResponse<void>>(`/${userId}/activate`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getUserById = async (userId: string): Promise<ApiResponse<User>> => {
    try {
        const response = await userApi.get<ApiResponse<User>>(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedUserById = async (userId: string): Promise<ApiResponse<User>> => {
    try {
        const response = await userApi.get<ApiResponse<User>>(`/deleted/${userId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getActiveUsers = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<User>> => {
    try {
        const response = await userApi.get<ApiResponsePaginated<User>>("/active", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInactiveUsers = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<User>> => {
    try {
        const response = await userApi.get<ApiResponsePaginated<User>>("/inactive", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getUserByEmail = async (email: string): Promise<ApiResponse<User>> => {
    try {
        const response = await userApi.get<ApiResponse<User>>("/by-email", { params: { email } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedUsersByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<User>> => {
    try {
        const response = await userApi.get<ApiResponsePaginated<User>>("/inactive/search", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getUsersByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<User>> => {
    try {
        const response = await userApi.get<ApiResponsePaginated<User>>("/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
    try {
        const response = await userApi.get<ApiResponse<User>>("/current-user");
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const changeNotificationStatus = async (): Promise<ApiResponse<void>> => {
    try {
        const response = await userApi.put<ApiResponse<void>>("/change-notifications-status");
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const changeChatNotificationStatus = async (): Promise<ApiResponse<void>> => {
    try {
        const response = await userApi.put<ApiResponse<void>>("/change-chat-notifications-status");
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateUserprofile = async (newUser: UpdateUser): Promise<ApiResponse<User>> => {
    try {
        const response = await userApi.put<ApiResponse<User>>("/update-user-profile", newUser);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const changeRoleUser = async (userId: string, role: string): Promise<ApiResponse<void>> => {
    try {
        const response = await userApi.put<ApiResponse<void>>(`/${userId}/change-role`, { role });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getMetrics = async (): Promise<ApiResponse<Metrics>> => {
    try {
        const response = await userApi.get<ApiResponse<Metrics>>("/metrics");
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}