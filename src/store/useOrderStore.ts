import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { cancelOrder, changeOrderStatus, createOrder, deleteOrder, getAllDeletedOrders, getAllOrders, getDeletedOrderById, getOrderById, getOrdersByClient, getOrdersByClientName, getOrdersByInventory, getOrdersByUser, restoreOrder, updateOrder } from "../services/OrderApi";
import { handleApiError } from "../utils/axiosUtils";
import type { NewOrder, Order } from "../types/Order";
import { create } from "zustand";
import type { PagedRequest } from "@/types/Request";

interface OrderState {
    isLoading: boolean;

    handleCreateOrder: (newOrder: NewOrder) => Promise<ApiResponse<Order>>;
    handleUpdateOrder: (orderId: string, newOrder: NewOrder) => Promise<ApiResponse<Order>>;
    handleDeleteOrder: (orderId: string) => Promise<ApiResponse<void>>;
    handleRestoreOrder: (orderId: string) => Promise<ApiResponse<void>>;
    fetchOrderById: (orderId: string) => Promise<ApiResponse<Order>>;
    fetchDeletedOrderById: (orderId: string) => Promise<ApiResponse<Order>>;
    fetchAllOrders: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Order>>;
    fetchAllDeletedOrders: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Order>>;
    fetchOrdersByClient: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Order>>;
    fetchOrdersByClientName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Order>>;
    fetchOrdersByUser: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Order>>;
    fetchOrdersByInventory: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Order>>;
    handleCancelOrder: (orderId: string) => Promise<ApiResponse<void>>;
    handleChangeOrderStatus: (orderId: string, status: string) => Promise<ApiResponse<void>>;
}

export const useOrderStore = create<OrderState>((set) => {
    return {
        isLoading: false,


        handleCreateOrder: async (newOrder) => {
            set({ isLoading: true });
            try {
                const data = await createOrder(newOrder);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateOrder: async (orderId, newOrder) => {
            set({ isLoading: true });
            try {
                const data = await updateOrder(orderId, newOrder);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteOrder: async (orderId) => {
            set({ isLoading: true });
            try {
                const data = await deleteOrder(orderId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreOrder: async (orderId) => {
            set({ isLoading: true });
            try {
                const data = await restoreOrder(orderId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrderById: async (orderId) => {
            set({ isLoading: true });
            try {
                const data = await getOrderById(orderId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedOrderById: async (orderId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedOrderById(orderId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllOrders: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllOrders(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedOrders: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedOrders(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrdersByClient: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getOrdersByClient(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrdersByClientName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getOrdersByClientName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrdersByUser: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getOrdersByUser(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchOrdersByInventory: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getOrdersByInventory(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleCancelOrder: async (orderId) => {
            set({ isLoading: true });
            try {
                const data = await cancelOrder(orderId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleChangeOrderStatus: async (orderId, status) => {
            set({ isLoading: true });
            try {
                const data = await changeOrderStatus(orderId, status);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },
    }
})
