import { create } from "zustand";
import type { Inventory, NewEntry, NewExitDisposal, NewExitTransfer, NewInventory } from "../types/Inventory";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import {createInventory, deleteInventory, getAllDeletedInventories, getAllInventories, getAvailableInventoriesByWarehouseId, getDeletedInventoriesByProductName, getDeletedInventoryById, getInventoriesByLowStock, getInventoriesByProductId, getInventoriesByProductName, getInventoriesByProductSku, getInventoriesByWarehouseId, getInventoryById, registerEntry, registerExitDisposal, registerExitTransfer, restoreInventoryById, updateInventory } from "../services/InventoryApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface InventoryState {
    isLoading: boolean;

    handleCreateInventory: (newInventory: NewInventory) => Promise<ApiResponse<Inventory>>;
    handleUpdateInventory: (inventoryId: string, newInventory: NewInventory) => Promise<ApiResponse<Inventory>>;
    handleDeleteInventory: (inventoryId: string) => Promise<ApiResponse<void>>;
    handleRestoreInventory: (inventoryId: string) => Promise<ApiResponse<void>>;
    fetchInventoryBYId: (inventoryId: string) => Promise<ApiResponse<Inventory>>;
    fetchDeletedInventoryBYId: (inventoryId: string) => Promise<ApiResponse<Inventory>>;
    fetchAllInventories: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchAllDeletedInventories: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchInventoriesBYWarehouseId: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchInventoriesBYProductId: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchDeletedInventoriesBYProductName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchInventoriesBYProductName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchInventoriesByProductSku: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchInventoriesByLowStock: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    fetchAvailableInventoriesByWarehouseId: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Inventory>>;
    handleRegisterEntry: (newEntry: NewEntry) => Promise<ApiResponse<void>>;
    handleRegisterExitTransfer: (newExit: NewExitTransfer) => Promise<ApiResponse<void>>;
    handleRegisterExitDisposal: (newExit: NewExitDisposal) => Promise<ApiResponse<void>>;
}


export const useInventoryStore = create<InventoryState>((set) => {
    return {
        isLoading: false,

        handleCreateInventory: async (newInventory) => {
            set({ isLoading: true });
            try {
                const data = await createInventory(newInventory);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateInventory: async (inventoryId, newInventory) => {
            set({ isLoading: true });
            try {
                const data = await updateInventory(inventoryId, newInventory);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteInventory: async (inventoryId) => {
            set({ isLoading: true });
            try {
                const data = await deleteInventory(inventoryId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreInventory: async (inventoryId) => {
            set({ isLoading: true });
            try {
                const data = await restoreInventoryById(inventoryId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInventoryBYId: async (inventoryId) => {
            set({ isLoading: true });
            try {
                const data = await getInventoryById(inventoryId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedInventoryBYId: async (inventoryId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedInventoryById(inventoryId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },


        fetchAllInventories: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllInventories(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedInventories: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedInventories(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInventoriesBYWarehouseId: async ( pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInventoriesByWarehouseId(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInventoriesBYProductId: async ( pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInventoriesByProductId(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInventoriesBYProductName: async ( pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInventoriesByProductName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInventoriesByProductSku: async ( pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInventoriesByProductSku(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedInventoriesBYProductName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedInventoriesByProductName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInventoriesByLowStock: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInventoriesByLowStock(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAvailableInventoriesByWarehouseId: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAvailableInventoriesByWarehouseId(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRegisterEntry: async (newEntry) => {
            set({ isLoading: true });
            try {
                const data = await registerEntry(newEntry);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRegisterExitDisposal: async (newExit) => {
            set({ isLoading: true });
            try {
                const data = await registerExitDisposal(newExit);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

         handleRegisterExitTransfer: async (newExit) => {
            set({ isLoading: true });
            try {
                const data = await registerExitTransfer(newExit);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },
    }
})