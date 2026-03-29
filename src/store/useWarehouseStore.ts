import { create } from "zustand";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import type { NewWarehouse, Warehouse } from "../types/Warehouse";
import { createWarehouse, deleteWarehouse, getAllDeletedWarehouses, getAllWarehouses, getDeletedWarehouseById, getDeletedWarehousesByName, getWarehouseById, getWarehousesByCapacity, getWarehousesByName, restoreWarehouse, updateWarehouse } from "../services/WarehouseApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface WarehouseState {
    isLoading: boolean;

    handleCreateWarehouse: (newWarehouse: NewWarehouse) => Promise<ApiResponse<Warehouse>>;
    handleUpdateWarehouse: (warehouseId: string, newWarehouse: NewWarehouse) => Promise<ApiResponse<Warehouse>>;
    handleDeleteWarehouse: (warehouseId: string) => Promise<ApiResponse<void>>;
    handleRestoreWarehouse: (warehouseId: string) => Promise<ApiResponse<void>>;
    fetchWarehouseById: (warehouseId: string) => Promise<ApiResponse<Warehouse>>;
    fetchDeletedWarehouseById: (warehouseId: string) => Promise<ApiResponse<Warehouse>>;
    fetchAllWarehouses: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Warehouse>>;
    fetchAllDeletedWarehouses: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Warehouse>>;
    fetchWarehousesByCapacity: (capacity: string, pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Warehouse>>;
    fetchWarehousesByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Warehouse>>;
    fetchDeletedWarehousesByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Warehouse>>;
}

export const useWarehouseStore = create<WarehouseState>((set) => {
    return {
        isLoading: false,


        handleCreateWarehouse: async (newWarehouse) => {
            set({ isLoading: true });
            try {
                const data = await createWarehouse(newWarehouse);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateWarehouse: async (warehouseId, newWarehouse) => {
            set({ isLoading: true });
            try {
                const data = await updateWarehouse(warehouseId, newWarehouse);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteWarehouse: async (warehouseId) => {
            set({ isLoading: true });
            try {
                const data = await deleteWarehouse(warehouseId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreWarehouse: async (warehouseId) => {
            set({ isLoading: true });
            try {
                const data = await restoreWarehouse(warehouseId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchWarehouseById: async (warehouseId) => {
            set({ isLoading: true });
            try {
                const data = await getWarehouseById(warehouseId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedWarehouseById: async (warehouseId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedWarehouseById(warehouseId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllWarehouses: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllWarehouses(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedWarehouses: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedWarehouses(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchWarehousesByCapacity: async (capacity, pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getWarehousesByCapacity(capacity, pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchWarehousesByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getWarehousesByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedWarehousesByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedWarehousesByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },
    }
})