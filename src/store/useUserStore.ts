import { create } from "zustand";
import type { ApiResponse, ApiResponsePaginated } from "../types/Response";
import type { Metrics, NewUser, UpdateUser, User } from "../types/User";
import { activateUser, changeChatNotificationStatus, changeNotificationStatus, changeRoleUser, createUser, deactivateUser, getActiveUsers, getCurrentUser, getDeletedUserById, getDeletedUsersByName, getInactiveUsers, getMetrics, getUserByEmail, getUserById, getUsersByName, updateUser, updateUserprofile } from "../services/UserApi";
import { handleApiError } from "../utils/axiosUtils";
import type { PagedRequest } from "@/types/Request";

interface UserState {
    isLoading: boolean;
    userProfileIsLoading: boolean;
    metricsIsLoading: boolean;
    userProfileResponse: ApiResponse<User> | null;
    metricsResponse: ApiResponse<Metrics> | null;

    clearUserData: () => void;
    handleCreateUser: (newUser: NewUser) => Promise<ApiResponse<User>>;
    handleUpdateUser: (userId: string, newUser: NewUser) => Promise<ApiResponse<User>>;
    handleUpdateUserProfile: (newUser: UpdateUser) => Promise<ApiResponse<User>>;
    handleDeactivateUser: (userId: string) => Promise<ApiResponse<void>>;
    handleActivateUser: (userId: string) => Promise<ApiResponse<void>>;
    fetchUserById: (userId: string) => Promise<ApiResponse<User>>;
    fetchDeletedUserById: (userId: string) => Promise<ApiResponse<User>>;
    fetchActiveUsers: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<User>>;
    fetchInactiveUsers: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<User>>;
    fetchDeletedUsersByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<User>>;
    fetchUsersByName: (pagedRequestDto: PagedRequest) => Promise<ApiResponsePaginated<User>>;
    fetchUserByEmail: (email: string) => Promise<ApiResponse<User>>;
    fetchCurrentUser: () => Promise<ApiResponse<User>>;
    handleChangeNotificationStatus: () => Promise<ApiResponse<void>>;
    handleChangeChatNotificationStatus: () => Promise<ApiResponse<void>>;
    handleChangeRoleUser: (userId: string, role: string) => Promise<ApiResponse<void>>;
    fetchMetrics: () => Promise<ApiResponse<Metrics>>;
}

export const useUserStore = create<UserState>((set) => {
    return {
        isLoading: false,
        userProfileIsLoading: false,
        metricsIsLoading: false,
        userProfileResponse: JSON.parse(localStorage.getItem("userProfileResponse") || "null"),
        metricsResponse: JSON.parse(localStorage.getItem("metricsResponse") || "null"),

        clearUserData: () => {
            localStorage.removeItem("userProfileResponse");
            localStorage.removeItem("metricsResponse");
            set({
                userProfileResponse: null,
                metricsResponse: null,
            });
        },


        handleCreateUser: async (newUser) => {
            set({ isLoading: true });
            try {
                const data = await createUser(newUser);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateUser: async (userId, newUser) => {
            set({ isLoading: true });
            try {
                const data = await updateUser(userId, newUser);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleUpdateUserProfile: async (newUser) => {
            set({ isLoading: true });
            try {
                const data = await updateUserprofile(newUser);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleDeactivateUser: async (userId) => {
            set({ isLoading: true });
            try {
                const data = await deactivateUser(userId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleActivateUser: async (userId) => {
            set({ isLoading: true });
            try {
                const data = await activateUser(userId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchUserById: async (userId) => {
            set({ isLoading: true });
            try {
                const data = await getUserById(userId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedUserById: async (userId) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedUserById(userId);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchUserByEmail: async (email) => {
            set({ isLoading: true });
            try {
                const data = await getUserByEmail(email);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchCurrentUser: async () => {
            set({ userProfileIsLoading: true, userProfileResponse: null });
            try {
                const data = await getCurrentUser();
                set({
                    userProfileResponse: data,
                    userProfileIsLoading: false,
                });
                localStorage.setItem("userProfileResponse", JSON.stringify(data));
                return data;
            } catch (error: unknown) {
                set({
                    userProfileIsLoading: false,
                });
                throw handleApiError(error)
            }
        },

        fetchMetrics: async () => {
            set({ metricsIsLoading: true, metricsResponse: null });
            try {
                const data = await getMetrics();
                set({
                    metricsResponse: data,
                    metricsIsLoading: false,
                });
                localStorage.setItem("metricsResponse", JSON.stringify(data));
                return data;
            } catch (error: unknown) {
                set({
                    metricsIsLoading: false,
                });
                throw handleApiError(error)
            }
        },
        fetchActiveUsers: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getActiveUsers(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchInactiveUsers: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getInactiveUsers(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        fetchDeletedUsersByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getDeletedUsersByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

         fetchUsersByName: async (pagedRequestDto) => {
            set({ isLoading: true });
            try {
                const data = await getUsersByName(pagedRequestDto);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleChangeChatNotificationStatus: async () => {
            set({ isLoading: true });
            try {
                const data = await changeChatNotificationStatus();
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleChangeNotificationStatus: async () => {
            set({ isLoading: true });
            try {
                const data = await changeNotificationStatus();
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        },

        handleChangeRoleUser: async (userId, role) => {
            set({ isLoading: true });
            try {
                const data = await changeRoleUser(userId, role);
                set({ isLoading: false });
                return data;
            } catch (error: unknown) {
                set({ isLoading: false });
                throw handleApiError(error)
            }
        }
    };
})