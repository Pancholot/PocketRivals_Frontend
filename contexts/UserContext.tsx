import { createContext, useContext, useEffect, useState } from "react";
import { secureStore } from "functions/secureStore";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "api/axiosInstance";

interface AuthContextType {
  user: any;
  setUser: (u: any) => void;
  loadUserFromToken: () => Promise<void>;
}

const UserContext = createContext<AuthContextType | null>(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadUserFromToken = async () => {
    try {
      let token = await secureStore.getItem("accessToken");

      let retries = 5;
      while (!token && retries > 0) {
        await new Promise((res) => setTimeout(res, 200));
        token = await secureStore.getItem("accessToken");
        retries--;
      }

      if (!token) {
        console.log("TOKEN NOT FOUND AFTER RETRIES");
        return;
      }

      const decoded: any = jwtDecode(token);

      const { data } = await axiosInstance.get(`/player/${decoded.sub}`);

      console.log("USER LOADED FROM API:", data);

      setUser({
        id: data.id,
        username: data.username,
        profile_picture: data.profile_picture ?? "default.png",
      });
    } catch (e) {
      console.log("LOAD USER ERROR:", e);
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadUserFromToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};
