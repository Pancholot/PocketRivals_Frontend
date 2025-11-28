import { createContext, useContext, useState, ReactNode } from "react";

type Request = {
  id: number;
  petitioner_name: string;
  petitioner: string;
  name: string;
  img: any;
};

type FriendRequestContextType = {
  requests: Request[];
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>;
};

const FriendRequestContext = createContext<FriendRequestContextType>({
  requests: [],
  setRequests: () => {},
});

export function FriendRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([]);

  return (
    <FriendRequestContext.Provider value={{ requests, setRequests }}>
      {children}
    </FriendRequestContext.Provider>
  );
}

export function useFriendRequests() {
  return useContext(FriendRequestContext);
}
