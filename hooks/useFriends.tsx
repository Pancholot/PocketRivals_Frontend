import { createContext, useContext, useState, ReactNode } from "react";

type Friend = {
  id: number;
  name: string;
  realId: string;
  lastCatch: string;
  img: any;
};

type FriendsContextType = {
  friends: Friend[];
  addFriend: (friend: Friend) => void;
};

const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  addFriend: () => {},
});

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "Eevee",
      realId: "11111",
      lastCatch: "Psyduck",
      img: require("@/assets/icons/profilePic2.png"),
    },
    {
      id: 2,
      name: "Pikachu",
      realId: "22222",
      lastCatch: "Onix",
      img: require("@/assets/icons/profilePic3.png"),
    },
    {
      id: 3,
      name: "Mudkop",
      realId: "33333",
      lastCatch: "Scyther",
      img: require("@/assets/icons/profilePic4.png"),
    },
  ]);

  const addFriend = (friend: Friend) => {
    setFriends((prev) => [...prev, friend]);
  };

  return (
    <FriendsContext.Provider value={{ friends, addFriend }}>
      {children}
    </FriendsContext.Provider>
  );
}

export function useFriends() {
  return useContext(FriendsContext);
}
