import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import type { NewWarehouse, Warehouse } from "../types/Warehouse";
import { api, handleApiError } from "../utils/axiosUtils";

const warehouseApi = api("warehouses");

export const createWarehouse = async (newWarehouse: NewWarehouse): Promise<ApiResponse<Warehouse>> => {
    try {
        const response = await warehouseApi.post<ApiResponse<Warehouse>>("", newWarehouse);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateWarehouse = async (warehouseId: string, newWarehouse: NewWarehouse): Promise<ApiResponse<Warehouse>> => {
    try {
        const response = await warehouseApi.put<ApiResponse<Warehouse>>(`/${warehouseId}`, newWarehouse);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteWarehouse = async (warehouseId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await warehouseApi.delete<ApiResponse<void>>(`/${warehouseId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreWarehouse = async (warehouseId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await warehouseApi.put<ApiResponse<void>>(`/${warehouseId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getWarehouseById = async (warehouseId: string): Promise<ApiResponse<Warehouse>> => {
    try {
        const response = await warehouseApi.get<ApiResponse<Warehouse>>(`/${warehouseId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedWarehouseById = async (warehouseId: string): Promise<ApiResponse<Warehouse>> => {
    try {
        const response = await warehouseApi.get<ApiResponse<Warehouse>>(`/deleted/${warehouseId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllWarehouses = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Warehouse>> => {
    try {
        const response = await warehouseApi.get<ApiResponsePaginated<Warehouse>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedWarehouses = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Warehouse>> => {
    try {
        const response = await warehouseApi.get<ApiResponsePaginated<Warehouse>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getWarehousesByCapacity = async (capacity: string, pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Warehouse>> => {
    try {
        const response = await warehouseApi.get<ApiResponsePaginated<Warehouse>>("/by-capacity", { params: { capacity, ...buildPagedParams(pagedRequestDto) } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getWarehousesByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Warehouse>> => {
    try {
        const response = await warehouseApi.get<ApiResponsePaginated<Warehouse>>("/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedWarehousesByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Warehouse>> => {
    try {
        const response = await warehouseApi.get<ApiResponsePaginated<Warehouse>>("/deleted/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}
