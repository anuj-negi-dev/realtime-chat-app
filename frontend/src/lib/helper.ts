import { useSocket } from "@/hooks/use-socket";

export const isUserOnline = (userId: string) => {
  if (!userId) return false;
  const { onlineUsers } = useSocket.getState();
  console.log("Online users from helper", onlineUsers);
  return onlineUsers.includes(userId);
};
