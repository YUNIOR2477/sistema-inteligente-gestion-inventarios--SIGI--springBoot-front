import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { Invoice, NewInvoice } from "../types/Invoice";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const invoiceApi = api("invoices");

export const createInvoice = async (newInvoice: NewInvoice): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.post<ApiResponse<Invoice>>("", newInvoice);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateInvoice = async (invoiceId: string, newInvoice: NewInvoice): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.put<ApiResponse<Invoice>>(`/${invoiceId}`, newInvoice);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteInvoice = async (invoiceId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await invoiceApi.delete<ApiResponse<void>>(`/${invoiceId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreInvoice = async (invoiceId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await invoiceApi.put<ApiResponse<void>>(`/${invoiceId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInvoiceById = async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponse<Invoice>>(`/${invoiceId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedInvoiceById = async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponse<Invoice>>(`/deleted/${invoiceId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllInvoices = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponsePaginated<Invoice>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedInvoices = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponsePaginated<Invoice>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInvoiceByNumber = async (number: string): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponse<Invoice>>("by-number", { params: { number } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInvoiceByOrder = async (orderId: string): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponse<Invoice>>("by-order", { params: { orderId } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedInvoiceByNumber = async (number: string): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponse<Invoice>>("/deleted/by-number", { params: { number } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInvoicesByClient = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponsePaginated<Invoice>>("by-client", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getInvoicesByStatus = async (status: string, pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Invoice>> => {
    try {
        const response = await invoiceApi.get<ApiResponsePaginated<Invoice>>("by-status", {
            params: {
                status,
                ...buildPagedParams(pagedRequestDto),
            },
        }
        );
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const issueInvoice = async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.post<ApiResponse<Invoice>>(`/${invoiceId}/issue`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const payInvoice = async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    try {
        const response = await invoiceApi.post<ApiResponse<Invoice>>(`/${invoiceId}/pay`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const cancelInvoice = async (invoiceId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await invoiceApi.post<ApiResponse<void>>(`/${invoiceId}/cancel`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}
