import { create } from "zustand";
import type { Client, NewClient } from "../types/Client";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { createClient, deleteClient, getAllClients, getAllDeletedClients, getClientById, getClientByIdentification, getClientsByName, getDeletedClientById, getDeletedClientsByName, restoreClientById, updateClient } from "../services/ClientApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface ClientState {
    isLoading: boolean;

    handleCreateClient: (newClient: NewClient) => Promise<ApiResponse<Client>>;
    handleUpdateClient: (clientId: string, newClient: NewClient) => Promise<ApiResponse<Client>>;
    handleDeleteClient: (clientId: string) => Promise<ApiResponse<void>>;
    handleRestoreClient: (clientId: string) => Promise<ApiResponse<void>>;
    fetchClientById: (clientId: string) => Promise<ApiResponse<Client>>;
    fetchDeletedClientById: (clientId: string) => Promise<ApiResponse<Client>>;
    fetchAllClients: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Client>>;
    fetchAllDeletedClients: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Client>>;
    fetchClientsByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Client>>;
    fetchDeletedClientsByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Client>>;
    fetchClientByIdentification: (identification: string) => Promise<ApiResponse<Client>>;
}

export const useClientStore = create<ClientState>((set) => {
    return {
        isLoading: false,

        handleCreateClient: async (newClient) => {
            set({ isLoading: true });
            try {
                const data = await createClient(newClient);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        handleUpdateClient: async (clientId, newClient) => {
            set({ isLoading: true });
            try {
                const data = await updateClient(clientId, newClient);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        handleDeleteClient: async (clientId) => {
            set({ isLoading: true });
            try {
                const data = await deleteClient(clientId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        handleRestoreClient: async (clientId) => {
            set({ isLoading: true });
            try {
                const data = await restoreClientById(clientId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchClientById: async (clientId) => {
            set({ isLoading: true });
            try {
                const data = await getClientById(clientId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchDeletedClientById: async (clientId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedClientById(clientId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchAllClients: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllClients(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchAllDeletedClients: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedClients(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchClientsByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getClientsByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchDeletedClientsByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedClientsByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },

        fetchClientByIdentification: async (identification) => {
            set({ isLoading: true });
            try {
                const data = await getClientByIdentification(identification);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error);
            }
        },
    }
})
