import { buildPagedParams, type PagedRequest } from "@/types/Request";
import type { NewProduct, Product } from "../types/Product";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { api, handleApiError } from "../utils/axiosUtils";

const productApi = api("products");

export const createProduct = async (newProduct: NewProduct): Promise<ApiResponse<Product>> => {
    try {
        const response = await productApi.post<ApiResponse<Product>>("", newProduct);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const updateProduct = async (productId: string, newProduct: NewProduct): Promise<ApiResponse<Product>> => {
    try {
        const response = await productApi.put<ApiResponse<Product>>(`/${productId}`, newProduct);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const deleteProduct = async (productId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await productApi.delete<ApiResponse<void>>(`/${productId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const restoreProduct = async (productId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await productApi.put<ApiResponse<void>>(`/${productId}/restore`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getProductById = async (productId: string): Promise<ApiResponse<Product>> => {
    try {
        const response = await productApi.get<ApiResponse<Product>>(`/${productId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedProductById = async (productId: string): Promise<ApiResponse<Product>> => {
    try {
        const response = await productApi.get<ApiResponse<Product>>(`/deleted/${productId}`);
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllProducts = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Product>> => {
    try {
        const response = await productApi.get<ApiResponsePaginated<Product>>("", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getAllDeletedProducts = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Product>> => {
    try {
        const response = await productApi.get<ApiResponsePaginated<Product>>("/deleted", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getProductBySku = async (sku: string): Promise<ApiResponse<Product>> => {
    try {
        const response = await productApi.get<ApiResponse<Product>>("by-sku", { params: { sku } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getProductsByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Product>> => {
    try {
        const response = await productApi.get<ApiResponsePaginated<Product>>("/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getDeletedProductsByName = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Product>> => {
    try {
        const response = await productApi.get<ApiResponsePaginated<Product>>("/deleted/by-name", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}


export const getProductsByCategory = async (pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Product>> => {
    try {
        const response = await productApi.get<ApiResponsePaginated<Product>>("/by-category", { params: buildPagedParams(pagedRequestDto) });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

export const getProductsPriceRange = async (min: string, max: string, pagedRequestDto: PagedRequest): Promise<ApiResponsePaginated<Product>> => {
    try {
        const response = await productApi.get<ApiResponsePaginated<Product>>("/by-price-range", { params: { min, max, ...buildPagedParams(pagedRequestDto) } });
        return response.data;
    } catch (error) {
        console.error(handleApiError(error))
        throw error;
    }
}

