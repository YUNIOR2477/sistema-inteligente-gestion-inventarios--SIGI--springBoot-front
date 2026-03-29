import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { Client, NewClient } from "../types/Client";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const clientApi = api("clients");

export const createClient = async (newClient: NewClient): Promise<ApiResponse<Client>> => {
    try {
        const response = await clientApi.post<ApiResponse<Client>>("", newClient);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateClient = async (clientId: string, newClient: NewClient): Promise<ApiResponse<Client>> => {
    try {
        const response = await clientApi.put<ApiResponse<Client>>(`/${clientId}`, newClient);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteClient = async (clientId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await clientApi.delete<ApiResponse<void>>(`/${clientId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreClientById = async (clientId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await clientApi.put<ApiResponse<void>>(`/${clientId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getClientById = async (clientId: string): Promise<ApiResponse<Client>> => {
    try {
        const response = await clientApi.get<ApiResponse<Client>>(`/${clientId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedClientById = async (clientId: string): Promise<ApiResponse<Client>> => {
    try {
        const response = await clientApi.get<ApiResponse<Client>>(`/deleted/${clientId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllClients = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Client>> => {
    try {
        const response = await clientApi.get<ApiResponsePaginated<Client>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedClients = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Client>> => {
    try {
        const response = await clientApi.get<ApiResponsePaginated<Client>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getClientsByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Client>> => {
    try {
        const response = await clientApi.get<ApiResponsePaginated<Client>>("/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedClientsByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Client>> => {
    try {
        const response = await clientApi.get<ApiResponsePaginated<Client>>("deleted/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getClientByIdentification = async (identification: string): Promise<ApiResponse<Client>> => {
    try {
        const response = await clientApi.get<ApiResponse<Client>>("by-identification", { params: { identification } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}
