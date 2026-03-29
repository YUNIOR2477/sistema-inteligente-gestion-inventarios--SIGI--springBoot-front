import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { Dispatcher, NewDispatcher } from "../types/Dispatcher";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const dispatcherApi = api("dispatchers");

export const createDispatcher = async (newDispatcher: NewDispatcher): Promise<ApiResponse<Dispatcher>> => {
    try {
        const response = await dispatcherApi.post<ApiResponse<Dispatcher>>("", newDispatcher);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateDispatcher = async (dispatcherId: string, newDispatcher: NewDispatcher): Promise<ApiResponse<Dispatcher>> => {
    try {
        const response = await dispatcherApi.put<ApiResponse<Dispatcher>>(`/${dispatcherId}`, newDispatcher);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteDispatcher = async (dispatcherId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await dispatcherApi.delete<ApiResponse<void>>(`/${dispatcherId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreDispatcher = async (dispatcherId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await dispatcherApi.put<ApiResponse<void>>(`/${dispatcherId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDispatcherById = async (dispatcherId: string): Promise<ApiResponse<Dispatcher>> => {
    try {
        const response = await dispatcherApi.get<ApiResponse<Dispatcher>>(`/${dispatcherId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedDispatcherById = async (dispatcherId: string): Promise<ApiResponse<Dispatcher>> => {
    try {
        const response = await dispatcherApi.get<ApiResponse<Dispatcher>>(`/deleted/${dispatcherId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDispatchers = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Dispatcher>> => {
    try {
        const response = await dispatcherApi.get<ApiResponsePaginated<Dispatcher>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedDispatchers = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Dispatcher>> => {
    try {
        const response = await dispatcherApi.get<ApiResponsePaginated<Dispatcher>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDispatchersByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Dispatcher>> => {
    try {
        const response = await dispatcherApi.get<ApiResponsePaginated<Dispatcher>>("by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedDispatchersByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Dispatcher>> => {
    try {
        const response = await dispatcherApi.get<ApiResponsePaginated<Dispatcher>>("/deleted/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

