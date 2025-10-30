import { api } from "@/lib/axios-client";
import type { UserType, RegisterType, LoginType } from "@/types/auth.type";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSocket } from "./use-socket";

interface AuthState {
  user: UserType | null;
  isLoggedIn: boolean;
  isSigningUp: boolean;
  isAuthStatusLoading: boolean;

  register: (data: RegisterType) => void;
  login: (data: LoginType) => void;
  logout: () => void;
  isAuthStatus: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isLoggedIn: false,
      isSigningUp: false,
      isAuthStatusLoading: false,

      register: async (data: RegisterType) => {
        set({ isSigningUp: true });
        try {
          const { data: response } = await api.post("/auth/register", data);
          set({ user: response });
          useSocket.getState().connectSocket();
          toast.success("User registered successfully");
        } catch (error: any) {
          console.error(error);
          toast.error(error.response.data.message);
        } finally {
          set({ isSigningUp: false });
        }
      },
      login: async (data: LoginType) => {
        set({ isLoggedIn: true });
        try {
          const { data: response } = await api.post("/auth/login", data);
          set({ user: response });
          useSocket.getState().connectSocket();
          toast.success("LoggedIn successfully");
        } catch (error: any) {
          console.error(error);
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggedIn: false });
        }
      },
      logout: async () => {
        set({ isLoggedIn: true });
        try {
          const { data: response } = await api.post("/auth/logout");
          set({ user: response });
          useSocket.getState().disconnectSocket();
          toast.success("LoggedOut successfully");
        } catch (error: any) {
          console.error(error);
          toast.error(error.response.data.message);
        }
      },
      isAuthStatus: async () => {
        set({ isAuthStatusLoading: true });
        try {
          const { data: response } = await api.get("/auth/status");
          set({ user: response });
          useSocket.getState().connectSocket();
        } catch (error: any) {
          console.error(error);
          toast.error(error.response.data.message);
        } finally {
          set({ isAuthStatusLoading: false });
        }
      },
    }),
    { name: "auth" }
  )
);
