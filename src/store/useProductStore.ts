import { create } from "zustand";
import type { NewProduct, Product } from "../types/Product";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import { createProduct, deleteProduct, getAllDeletedProducts, getAllProducts, getDeletedProductById, getDeletedProductsByName, getProductById, getProductBySku, getProductsByCategory, getProductsByName, getProductsPriceRange, restoreProduct, updateProduct } from "../services/ProductApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface ProductStore {
    isLoading: boolean;

    handleCreateProduct: (newProduct: NewProduct) => Promise<ApiResponse<Product>>;
    handleUpdateProduct: (productId: string, newProduct: NewProduct) => Promise<ApiResponse<Product>>;
    handleDeleteProduct: (productId: string) => Promise<ApiResponse<void>>;
    handleRestoreProduct: (productId: string) => Promise<ApiResponse<void>>;
    fetchProductById: (productId: string) => Promise<ApiResponse<Product>>;
    fetchDeletedProductById: (productId: string) => Promise<ApiResponse<Product>>;
    fetchAllProducts: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Product>>;
    fetchAllDeletedProducts: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Product>>;
    fetchProductBySku: (sku: string) => Promise<ApiResponse<Product>>;
    fetchProductsByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Product>>;
    fetchDeletedProductsByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Product>>;
    fetchProductsByCategory: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Product>>;
    fetchProductsByPriceRange: (min: string, max: string, pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<Product>>;
}

export const useProductStore = create<ProductStore>((set) => {
    return {
        isLoading: false,

        handleCreateProduct: async (newProduct) => {
            set({ isLoading: true });
            try {
                const data = await createProduct(newProduct);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateProduct: async (productId, newProduct) => {
            set({ isLoading: true });
            try {
                const data = await updateProduct(productId, newProduct);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeleteProduct: async (productId: string): Promise<ApiResponse<void>> => {
            set({ isLoading: true });
            try {
                const data = await deleteProduct(productId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleRestoreProduct: async (productId) => {
            set({ isLoading: true });
            try {
                const data = await restoreProduct(productId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchProductById: async (productId) => {
            set({ isLoading: true });
            try {
                const data = await getProductById(productId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedProductById: async (productId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedProductById(productId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllProducts: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllProducts(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchAllDeletedProducts: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getAllDeletedProducts(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchProductBySku: async (sku) => {
            set({ isLoading: true });
            try {
                const data = await getProductBySku(sku);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchProductsByCategory: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getProductsByCategory(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchProductsByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getProductsByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedProductsByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedProductsByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchProductsByPriceRange: async (min, max, pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getProductsPriceRange(min, max, pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },
    }
})