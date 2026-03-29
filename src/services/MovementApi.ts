import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { Movement, NewMovement } from "../types/Movement";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const movementApi = api("movements");

export const updateMovement = async (movementId: string, newMovement: NewMovement): Promise<ApiResponse<Movement>> => {
    try {
        const response = await movementApi.put<ApiResponse<Movement>>(`/${movementId}`, newMovement);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteMovement = async (movementId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await movementApi.delete<ApiResponse<void>>(`/${movementId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreMovement = async (movementId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await movementApi.put<ApiResponse<void>>(`/${movementId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getMovementById = async (movementId: string): Promise<ApiResponse<Movement>> => {
    try {
        const response = await movementApi.get<ApiResponse<Movement>>(`/${movementId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedMovementById = async (movementId: string): Promise<ApiResponse<Movement>> => {
    try {
        const response = await movementApi.get<ApiResponse<Movement>>(`/deleted/${movementId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllMovements = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Movement>> => {
    try {
        const response = await movementApi.get<ApiResponsePaginated<Movement>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedMovements = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Movement>> => {
    try {
        const response = await movementApi.get<ApiResponsePaginated<Movement>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getMovementsByProduct = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Movement>> => {
    try {
        const response = await movementApi.get<ApiResponsePaginated<Movement>>("/by-product", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getMovementsByOrder = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Movement>> => {
    try {
        const response = await movementApi.get<ApiResponsePaginated<Movement>>("/by-order", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getMovementsByDispatcher = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Movement>> => {
    try {
        const response = await movementApi.get<ApiResponsePaginated<Movement>>("/by-dispatcher", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getMovementsByType = async (
    type: string, pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Movement>> => {
    try {
        pagedRequestDto.searchValue = type;
        const response = await movementApi.get<ApiResponsePaginated<Movement>>(
            "/by-type",
            { params: buildPagedParams(pagedRequestDto) }
        );
        return response.data;
    } catch (error) {
        console.error(handleApiError(error));
        throw error;
    }
};

export const getDeletedMovementsByType = async (type: string, pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Movement>> => {
    try {
        pagedRequestDto.searchValue = type;
        const response = await movementApi.get<ApiResponsePaginated<Movement>>("/deleted/by-type", { params: { type, ...buildPagedParams(pagedRequestDto), } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

