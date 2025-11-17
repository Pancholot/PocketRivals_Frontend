import { createContext, useContext, useState, ReactNode } from "react";

type Request = {
  id: number;
  realId: string;
  name: string;
  img: any;
};

type FriendRequestContextType = {
  requests: Request[];
  addRequest: (req: Request) => void;
  removeRequest: (id: number) => void;
};

const FriendRequestContext = createContext<FriendRequestContextType>({
  requests: [],
  addRequest: () => {},
  removeRequest: () => {},
});

export function FriendRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([]);

  const addRequest = (req: Request) => {
    setRequests((prev) => [...prev, req]);
  };

  const removeRequest = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <FriendRequestContext.Provider
      value={{ requests, addRequest, removeRequest }}
    >
      {children}
    </FriendRequestContext.Provider>
  );
}

export function useFriendRequests() {
  return useContext(FriendRequestContext);
}
