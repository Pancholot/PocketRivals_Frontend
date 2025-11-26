import { createContext, useContext, useEffect, useState } from "react";
import { secureStore } from "functions/secureStore";
import { jwtDecode } from "jwt-decode";

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
      const token = await secureStore.getItem("accessToken");
      if (!token) return;

      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (e) {
      console.log("Error loading token:", e);
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
