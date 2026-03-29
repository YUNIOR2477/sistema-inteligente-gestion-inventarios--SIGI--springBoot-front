import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { NewOrderLine, OrderLine } from "../types/OrderLine";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const orderLineApi = api("order-lines");

export const createOrderLine = async (orderId: string, newOrderLine: NewOrderLine): Promise<ApiResponse<OrderLine>> => {
    try {
        const response = await orderLineApi.post<ApiResponse<OrderLine>>("", newOrderLine, { params: { orderId } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateOrderLine = async (orderLineId: string, newOrderLine: NewOrderLine): Promise<ApiResponse<OrderLine>> => {
    try {
        const response = await orderLineApi.put<ApiResponse<OrderLine>>(`/${orderLineId}`, newOrderLine);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteOrderLine = async (orderLineId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await orderLineApi.delete<ApiResponse<void>>(`/${orderLineId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreOrderLine = async (orderLineId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await orderLineApi.put<ApiResponse<void>>(`/${orderLineId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getOrderLineById = async (orderLineId: string): Promise<ApiResponse<OrderLine>> => {
    try {
        const response = await orderLineApi.get<ApiResponse<OrderLine>>(`/${orderLineId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedOrderLineById = async (orderLineId: string): Promise<ApiResponse<OrderLine>> => {
    try {
        const response = await orderLineApi.get<ApiResponse<OrderLine>>(`/deleted/${orderLineId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllOrderLines = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<OrderLine>> => {
    try {
        const response = await orderLineApi.get<ApiResponsePaginated<OrderLine>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedOrderLines = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<OrderLine>> => {
    try {
        const response = await orderLineApi.get<ApiResponsePaginated<OrderLine>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getOrdersLineByOrderId = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<OrderLine>> => {
    try {
        const response = await orderLineApi.get<ApiResponsePaginated<OrderLine>>("/by-order", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getOrdersLineByProductName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<OrderLine>> => {
    try {
        const response = await orderLineApi.get<ApiResponsePaginated<OrderLine>>("/by-product-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedOrdersLineByProductName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<OrderLine>> => {
    try {
        const response = await orderLineApi.get<ApiResponsePaginated<OrderLine>>("/deleted/by-product-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}