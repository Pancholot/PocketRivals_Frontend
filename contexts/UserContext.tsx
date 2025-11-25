import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: any;
  setUser: (u: any) => void;
}

const UserContext = createContext<AuthContextType | null>(null);

export const UserProvider = ({ children }) => {
  // Aquí guardas el objeto del usuario
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
