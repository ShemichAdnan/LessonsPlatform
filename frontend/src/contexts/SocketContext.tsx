import React, { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
  totalUnread: number;
  refreshUnreadCounts: () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  totalUnread: 0,
  refreshUnreadCounts: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [totalUnread, setTotalUnread] = useState<number>(0);

  const refreshUnreadCounts = () => {
    if (!socket) return;
    socket.emit("getUnreadCount", null, (resp: any) => {
      if (!resp?.success) return;
      setTotalUnread(resp.totalUnread ?? 0);
    });
  };

  useEffect(() => {
    if (!currentUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setConnected(false);
      setTotalUnread(0);
      return;
    }

    const socketInstance = io("http://localhost:4000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    setSocket(socketInstance);

    const onConnect = () => {
      setConnected(true);
      socketInstance.emit("getUnreadCount", null, (resp: any) => {
        if (!resp?.success) return;
        setTotalUnread(resp.totalUnread ?? 0);
      });
    };
    const onDisconnect = () => setConnected(false);

    const onNotification = (payload: any) => {
      if (payload?.type !== "new_message") return;
      socketInstance.emit("getUnreadCount", null, (resp: any) => {
        if (!resp?.success) return;
        setTotalUnread(resp.totalUnread ?? 0);
      });
    };

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);
    socketInstance.on("notification", onNotification);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
      socketInstance.off("notification", onNotification);
      socketInstance.disconnect();
    };
  }, [currentUser?.id]);

  return (
    <SocketContext.Provider
      value={{ socket, connected, totalUnread, refreshUnreadCounts }}
    >
      {children}
    </SocketContext.Provider>
  );
};
