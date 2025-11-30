import { createContext, useContext, useState } from "react";

const TradeNotifContext = createContext(null);

export function TradeNotifProvider({ children }) {
  const [tradeAcceptedMessage, setTradeAcceptedMessage] = useState(null);

  return (
    <TradeNotifContext.Provider
      value={{ tradeAcceptedMessage, setTradeAcceptedMessage }}
    >
      {children}
    </TradeNotifContext.Provider>
  );
}

export const useTradeNotif = () => useContext(TradeNotifContext);
