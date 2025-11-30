import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { secureStore } from "../functions/secureStore";
import { useUser } from "./UserContext";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const s = io("https://pocket-rivals-backend-ncc7.onrender.com", {
      transports: ["websocket"],
      reconnection: true,
    });

    s.on("connect", () => {
      console.log("WS conectado:", s.id);
      s.emit("connect_user", { user_id: user.id });
    });

    s.on("disconnect", () => {
      console.log("WS desconectado");
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
