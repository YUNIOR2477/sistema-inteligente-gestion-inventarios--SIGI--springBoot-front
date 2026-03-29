import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { NewOrder, Order } from "../types/Order";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const orderApi = api("orders");

export const createOrder = async (
  newOrder: NewOrder,
): Promise<ApiResponse<Order>> => {
  try {
    const response = await orderApi.post<ApiResponse<Order>>("", newOrder);
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const updateOrder = async (
  orderId: string,
  newOrder: NewOrder,
): Promise<ApiResponse<Order>> => {
  try {
    const response = await orderApi.put<ApiResponse<Order>>(
      `/${orderId}`,
      newOrder,
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const deleteOrder = async (
  orderId: string,
): Promise<ApiResponse<void>> => {
  try {
    const response = await orderApi.delete<ApiResponse<void>>(`/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const restoreOrder = async (
  orderId: string,
): Promise<ApiResponse<void>> => {
  try {
    const response = await orderApi.put<ApiResponse<void>>(
      `/${orderId}/restore`,
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const getOrderById = async (
  orderId: string,
): Promise<ApiResponse<Order>> => {
  try {
    const response = await orderApi.get<ApiResponse<Order>>(`/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const getDeletedOrderById = async (
  orderId: string,
): Promise<ApiResponse<Order>> => {
  try {
    const response = await orderApi.get<ApiResponse<Order>>(
      `/deleted/${orderId}`,
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const getAllOrders = async (
  pagedRequestDto: PagedRequest
): Promise<ApiResponsePaginated<Order>> => {
  try {
    const response = await orderApi.get<ApiResponsePaginated<Order>>("", {
      params: buildPagedParams(pagedRequestDto),
    });
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const getAllDeletedOrders = async (
  pagedRequestDto: PagedRequest
): Promise<ApiResponsePaginated<Order>> => {
  try {
    const response = await orderApi.get<ApiResponsePaginated<Order>>(
      "/deleted",
      { params: buildPagedParams(pagedRequestDto) },
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};
export const getOrdersByClient = async (

  pagedRequestDto: PagedRequest
): Promise<ApiResponsePaginated<Order>> => {
  try {
    const response = await orderApi.get<ApiResponsePaginated<Order>>(
      "by-client",
      { params: buildPagedParams(pagedRequestDto) },
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const getOrdersByClientName = async (
  pagedRequestDto: PagedRequest
): Promise<ApiResponsePaginated<Order>> => {
  try {
    const response = await orderApi.get<ApiResponsePaginated<Order>>(
      "by-client-name",
      { params: buildPagedParams(pagedRequestDto) },
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const getOrdersByUser = async (
  pagedRequestDto: PagedRequest
): Promise<ApiResponsePaginated<Order>> => {
  try {
    const response = await orderApi.get<ApiResponsePaginated<Order>>(
      "by-user",
      { params: buildPagedParams(pagedRequestDto)},
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const getOrdersByInventory = async (
  pagedRequestDto: PagedRequest
): Promise<ApiResponsePaginated<Order>> => {
  try {
    const response = await orderApi.get<ApiResponsePaginated<Order>>(
      "by-inventory",
      { params: buildPagedParams(pagedRequestDto) },
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const cancelOrder = async (
  orderId: string,
): Promise<ApiResponse<void>> => {
  try {
    const response = await orderApi.put<ApiResponse<void>>(
      `/${orderId}/cancel`,
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};

export const changeOrderStatus = async (
  orderId: string,
  status: string,
): Promise<ApiResponse<void>> => {
  try {
    const response = await orderApi.put<ApiResponse<void>>(
      `/${orderId}/change-status`,
      {},
      { params: { status } },
    );
    return response.data;
  } catch (error) {
    console.error(handleApiError(error));
    throw error;
  }
};
