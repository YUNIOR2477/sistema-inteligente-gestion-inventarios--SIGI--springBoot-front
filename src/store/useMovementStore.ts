import { create } from "zustand";
import type { Movement, NewMovement } from "../types/Movement";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { deleteMovement, getAllDeletedMovements, getAllMovements, getDeletedMovementById, getDeletedMovementsByType, getMovementById, getMovementsByDispatcher, getMovementsByOrder, getMovementsByProduct, getMovementsByType, restoreMovement, updateMovement } from "../services/MovementApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface MovementState {
    isLoading: boolean;

    handleUpdateMovement: (movementId: string, newMovement: NewMovement) => Promise<ApiResponse<Movement>>;
    handleDeleteMovement: (movementId: string) => Promise<ApiResponse<void>>;
    handleRestoreMovement: (movementId: string) => Promise<ApiResponse<void>>;
    fetchMovementById: (movementId: string) => Promise<ApiResponse<Movement>>;
    fetchDeletedMovementById: (movementId: string) => Promise<ApiResponse<Movement>>;
    fetchAllMovements: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Movement>>;
    fetchAllDeletedMovements: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Movement>>;
    fetchMovementsByProduct: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Movement>>;
    fetchMovementsByOrder: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Movement>>;
    fetchMovementsByDispatcher: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Movement>>;
    fetchMovementsByType: (type: string, pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Movement>>;
    fetchDeletedMovementsByType: (type: string, pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Movement>>;
}

export const useMovementStore = create<MovementState>((set) => {
    return {
        isLoading: false,

        handleUpdateMovement: async (movementId, newMovement) => {
            set({ isLoading: true });
            try {
                const data = await updateMovement(movementId, newMovement);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteMovement: async (movementId) => {
            set({ isLoading: true });
            try {
                const data = await deleteMovement(movementId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreMovement: async (movementId) => {
            set({ isLoading: true });
            try {
                const data = await restoreMovement(movementId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchMovementById: async (movementId) => {
            set({ isLoading: true });
            try {
                const data = await getMovementById(movementId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedMovementById: async (movementId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedMovementById(movementId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllMovements: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllMovements(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedMovements: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedMovements(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchMovementsByDispatcher: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getMovementsByDispatcher(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchMovementsByOrder: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getMovementsByOrder(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchMovementsByProduct: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getMovementsByProduct(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchMovementsByType: async (type, pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getMovementsByType(type, pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedMovementsByType: async (type, pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedMovementsByType(type, pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },
    }
})