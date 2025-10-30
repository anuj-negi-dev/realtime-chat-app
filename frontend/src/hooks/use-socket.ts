import { io, Socket } from "socket.io-client";
import { create } from "zustand";

interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useSocket = create<SocketState>()((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const { socket } = get();
    if (socket?.connected) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      autoConnect: true,
    });

    set({ socket: newSocket });

    newSocket.on("connect", () => {
      console.log("socket connected", newSocket.id);
    });

    newSocket.on("online:users", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
      });
    }
  },
}));
