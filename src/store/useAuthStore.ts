import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import type { UserLogin } from "../types/User";
import { login } from "../services/AuthApi";
import { handleApiError } from "../utils/axiosUtils";
import { useUserStore } from "./useUserStore";

interface JwtPayload {
  roles?: string;
  exp?: number;
}

interface AuthState {
  isLoading: boolean;
  userToken: string | null;
  userRole: string | null;
  isAuthenticated: boolean;

  handleLogin: (user: UserLogin) => Promise<void>;
  logout: () => void;
  checkToken: () => void;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return !decoded.exp || decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      userToken: null,
      userRole: null,
      isAuthenticated: false,

      handleLogin: async (user) => {
        set({ isLoading: true });
        try {
          const token = await login(user);
          const decoded: JwtPayload = jwtDecode(token.data);

          set({
            userToken: token.data,
            userRole: decoded.roles || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            userToken: null,
            userRole: null,
            isAuthenticated: false,
          });
          throw handleApiError(error);
        }
      },

      logout: () => {
        set({
          userToken: null,
          userRole: null,
          isAuthenticated: false,
          isLoading: false,
        });
        useUserStore.getState().clearUserData();
      },

      checkToken: () => {
        const token = get().userToken;
        if (!token || isTokenExpired(token)) {
          set({
            userToken: null,
            userRole: null,
            isAuthenticated: false,
            isLoading: false,
          });
          useUserStore.getState().clearUserData();
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
