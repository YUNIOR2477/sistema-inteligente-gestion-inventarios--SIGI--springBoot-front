import { create } from "zustand";
import type { Invoice, NewInvoice } from "../types/Invoice";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { cancelInvoice, createInvoice, deleteInvoice, getAllDeletedInvoices, getAllInvoices, getDeletedInvoiceById, getDeletedInvoiceByNumber, getInvoiceById, getInvoiceByNumber, getInvoiceByOrder, getInvoicesByClient, getInvoicesByStatus, issueInvoice, payInvoice, restoreInvoice, updateInvoice } from "../services/InvoiceApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface InvoiceState {
    isLoading: boolean;

    handleCreateInvoice: (newInvoice: NewInvoice) => Promise<ApiResponse<Invoice>>;
    handleUpdateInvoice: (invoiceId: string, newInvoice: NewInvoice) => Promise<ApiResponse<Invoice>>;
    handleDeleteInvoice: (invoiceId: string) => Promise<ApiResponse<void>>;
    handleRestoreInvoice: (invoiceId: string) => Promise<ApiResponse<void>>;
    fetchInvoiceById: (invoiceId: string) => Promise<ApiResponse<Invoice>>;
    fetchDeletedInvoiceById: (invoiceId: string) => Promise<ApiResponse<Invoice>>;
    fetchAllInvoices: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Invoice>>;
    fetchAllDeletedInvoices: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Invoice>>;
    fetchInvoiceByNumber: (number: string) => Promise<ApiResponse<Invoice>>;
    fetchInvoiceByOrder: (orderId: string) => Promise<ApiResponse<Invoice>>;
    fetchDeletedInvoiceByNumber: (number: string) => Promise<ApiResponse<Invoice>>;
    fetchInvoicesByClient: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Invoice>>;
    fetchInvoicesByStatus: (status: string,pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Invoice>>;
    handleIssueInvoice: (invoiceId: string) => Promise<ApiResponse<Invoice>>;
    handlePayInvoice: (invoiceId: string) => Promise<ApiResponse<Invoice>>;
    handleCancelInvoice: (invoiceId: string) => Promise<ApiResponse<void>>;
}

export const useInvoiceStore = create<InvoiceState>((set) => {
    return {
        isLoading: false,


        handleCreateInvoice: async (newInvoice) => {
            set({ isLoading: true });
            try {
                const data = await createInvoice(newInvoice);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateInvoice: async (invoiceId, newInvoice) => {
            set({ isLoading: true });
            try {
                const data = await updateInvoice(invoiceId, newInvoice);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteInvoice: async (invoiceId) => {
            set({ isLoading: true });
            try {
                const data = await deleteInvoice(invoiceId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreInvoice: async (invoiceId) => {
            set({ isLoading: true });
            try {
                const data = await restoreInvoice(invoiceId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInvoiceById: async (invoiceId) => {
            set({ isLoading: true });
            try {
                const data = await getInvoiceById(invoiceId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedInvoiceById: async (invoiceId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedInvoiceById(invoiceId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllInvoices: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllInvoices(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedInvoices: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedInvoices(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInvoiceByNumber: async (number) => {
            set({ isLoading: true });
            try {
                const data = await getInvoiceByNumber(number);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInvoiceByOrder: async (orderId) => {
            set({ isLoading: true });
            try {
                const data = await getInvoiceByOrder(orderId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedInvoiceByNumber: async (number) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedInvoiceByNumber(number);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInvoicesByClient: async ( pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInvoicesByClient( pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInvoicesByStatus: async (status, pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInvoicesByStatus(status, pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleIssueInvoice: async (invoiceId) => {
            set({ isLoading: true });
            try {
                const data = await issueInvoice(invoiceId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handlePayInvoice: async (invoiceId) => {
            set({ isLoading: true });
            try {
                const data = await payInvoice(invoiceId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleCancelInvoice: async (invoiceId) => {
            set({ isLoading: true });
            try {
                const data = await cancelInvoice(invoiceId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

    }
})