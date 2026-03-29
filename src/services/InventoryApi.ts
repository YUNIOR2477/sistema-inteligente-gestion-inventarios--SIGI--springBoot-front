import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { Inventory, NewEntry, NewExitDisposal, NewExitTransfer, NewInventory } from "../types/Inventory";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const inventoryApi = api("inventories");

export const createInventory = async (newInventory: NewInventory): Promise<ApiResponse<Inventory>> => {
    try {
        const response = await inventoryApi.post<ApiResponse<Inventory>>("", newInventory);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateInventory = async (inventoryId: string, newInventory: NewInventory): Promise<ApiResponse<Inventory>> => {
    try {
        const response = await inventoryApi.put<ApiResponse<Inventory>>(`/${inventoryId}`, newInventory);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteInventory = async (inventoryId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await inventoryApi.delete<ApiResponse<void>>(`/${inventoryId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreInventoryById = async (inventoryId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await inventoryApi.put<ApiResponse<void>>(`/${inventoryId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInventoryById = async (inventoryId: string): Promise<ApiResponse<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponse<Inventory>>(`/${inventoryId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedInventoryById = async (inventoryId: string): Promise<ApiResponse<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponse<Inventory>>(`/deleted/${inventoryId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllInventories = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedInventories = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInventoriesByWarehouseId = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/by-warehouse", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInventoriesByProductId = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/by-product", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInventoriesByLowStock = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/low-stock", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAvailableInventoriesByWarehouseId = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/by-available-warehouse", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInventoriesByProductName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/by-product-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInventoriesByProductSku = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/by-product-sku", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}


export const getDeletedInventoriesByProductName = async ( pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Inventory>> => {
    try {
        const response = await inventoryApi.get<ApiResponsePaginated<Inventory>>("/deleted/by-product-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const registerEntry = async (newEntry: NewEntry): Promise<ApiResponse<void>> => {
    try {
        const response = await inventoryApi.post<ApiResponse<void>>("/register-entry", newEntry);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const registerExitTransfer = async (newExit: NewExitTransfer): Promise<ApiResponse<void>> => {
    try {
        const response = await inventoryApi.post<ApiResponse<void>>("/register-transfer", newExit);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const registerExitDisposal = async (newExit: NewExitDisposal): Promise<ApiResponse<void>> => {
    try {
        const response = await inventoryApi.post<ApiResponse<void>>("/register-disposal", newExit);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

