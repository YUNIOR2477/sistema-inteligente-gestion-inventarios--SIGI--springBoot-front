import { create } from "zustand";
import type { Dispatcher, NewDispatcher } from "../types/Dispatcher";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { createDispatcher, deleteDispatcher, getAllDeletedDispatchers, getAllDispatchers, getDeletedDispatcherById, getDeletedDispatchersByName, getDispatcherById, getDispatchersByName, restoreDispatcher, updateDispatcher } from "../services/DispatcherApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface DispatcherState {
    isLoading: boolean;

    handleCreateDispatcher: (newDispatcher: NewDispatcher) => Promise<ApiResponse<Dispatcher>>;
    handleUpdateDispatcher: (dispatcherId: string, newDispatcher: NewDispatcher) => Promise<ApiResponse<Dispatcher>>;
    handleDeleteDispatcher: (dispatcherId: string) => Promise<ApiResponse<void>>;
    handleRestoreDispatcher: (dispatcherId: string) => Promise<ApiResponse<void>>;
    fetchDispatcherById: (dispatcherId: string) => Promise<ApiResponse<Dispatcher>>;
    fetchDeletedDispatcherById: (dispatcherId: string) => Promise<ApiResponse<Dispatcher>>;
    fetchAllDispatchers: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Dispatcher>>;
    fetchAllDeletedDispatchers: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Dispatcher>>;
    fetchDispatchersByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Dispatcher>>;
    fetchDeletedDispatchersByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Dispatcher>>;

}

export const useDispatcherStore = create<DispatcherState>((set) => {
    return {
        isLoading: false,

        handleCreateDispatcher: async (newDispatcher) => {
            set({ isLoading: true });
            try {
                const data = await createDispatcher(newDispatcher);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateDispatcher: async (dispatcherId, newDispatcher) => {
            set({ isLoading: true });
            try {
                const data = await updateDispatcher(dispatcherId, newDispatcher);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteDispatcher: async (dispatcherId) => {
            set({ isLoading: true });
            try {
                const data = await deleteDispatcher(dispatcherId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreDispatcher: async (dispatcherId) => {
            set({ isLoading: true });
            try {
                const data = await restoreDispatcher(dispatcherId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDispatcherById: async (dispatcherId) => {
            set({ isLoading: true });
            try {
                const data = await getDispatcherById(dispatcherId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedDispatcherById: async (dispatcherId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedDispatcherById(dispatcherId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDispatchers: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDispatchers(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedDispatchers: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedDispatchers(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDispatchersByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDispatchersByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedDispatchersByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedDispatchersByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },
    }
})