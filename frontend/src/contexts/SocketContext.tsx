import React,{createContext,useContext,useEffect,useRef, useState} from "react";
import { set } from "react-hook-form";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode,userId:string }> = ({ children, userId }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io("http://localhost:4000", {
            withCredentials: true,
            transports: ['websocket'],
        });

        setSocket(socketInstance);

        socketInstance.emit("login", userId);

        return () => {
            socketInstance.disconnect();
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket}}>
            {children}
        </SocketContext.Provider>
    );
}