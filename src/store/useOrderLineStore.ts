import { create } from "zustand";
import type { NewOrderLine, OrderLine } from "../types/OrderLine";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { createOrderLine, deleteOrderLine, getAllDeletedOrderLines, getAllOrderLines, getDeletedOrdersLineByProductName, getOrderLineById, getOrdersLineByOrderId, getOrdersLineByProductName, restoreOrderLine, updateOrderLine } from "../services/OrderLineApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface OrderLineState {
    isLoading: boolean;

    handleCreateOrderLine: (orderId: string, newOrderLine: NewOrderLine) => Promise<ApiResponse<OrderLine>>;
    handleUpdateOrderLine: (orderLineId: string, newOrderLine: NewOrderLine) => Promise<ApiResponse<OrderLine>>;
    handleDeleteOrderLine: (orderLIneId: string) => Promise<ApiResponse<void>>;
    handleRestoreOrderLine: (orderLIneId: string) => Promise<ApiResponse<void>>;
    fetchOrderLineById: (orderLIneId: string) => Promise<ApiResponse<OrderLine>>;
    fetchAllOrderLines: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<OrderLine>>;
    fetchAllDeletedOrderLines: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<OrderLine>>;
    fetchOrderLineByOrderId: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<OrderLine>>;
    fetchOrderLineByProductName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<OrderLine>>;
    fetchDeletedOrderLineByProductName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<OrderLine>>;
}

export const useOrderLineStore = create<OrderLineState>((set) => {
    return {
        isLoading: false,

        handleCreateOrderLine: async (orderId, newOrderLine) => {
            set({ isLoading: true });
            try {
                const data = await createOrderLine(orderId, newOrderLine);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateOrderLine: async (orderLineId, newOrderLine) => {
            set({ isLoading: true });
            try {
                const data = await updateOrderLine(orderLineId, newOrderLine);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteOrderLine: async (orderLIneId) => {
            set({ isLoading: true });
            try {
                const data = await deleteOrderLine(orderLIneId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreOrderLine: async (orderLIneId) => {
            set({ isLoading: true });
            try {
                const data = await restoreOrderLine(orderLIneId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrderLineById: async (orderLIneId) => {
            set({ isLoading: true });
            try {
                const data = await getOrderLineById(orderLIneId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllOrderLines: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllOrderLines(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedOrderLines: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedOrderLines(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrderLineByOrderId: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getOrdersLineByOrderId(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrderLineByProductName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getOrdersLineByProductName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedOrderLineByProductName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedOrdersLineByProductName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },
    }
})