import { createContext, useContext, useState, ReactNode } from "react";

type Friend = {
  id: string;
  username: string;
  last_captured: string;
  profile_picture: string;
};

type FriendsContextType = {
  friends: Friend[];
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  addFriend: (friend: Friend) => void;
};

const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  setFriends: () => {},
  addFriend: () => {},
});

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>([]);

  const addFriend = (friend: Friend) => {
    setFriends((prev) => [...prev, friend]);
  };

  return (
    <FriendsContext.Provider value={{ friends, setFriends, addFriend }}>
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}
