import { createContext, useContext, useState } from "react";

const TradeRequestsContext = createContext(null);

export function TradeRequestsProvider({ children }) {
  const [tradeRequests, setTradeRequests] = useState([]);

  return (
    <TradeRequestsContext.Provider value={{ tradeRequests, setTradeRequests }}>
      {children}
    </TradeRequestsContext.Provider>
  );
}

export function useTradeRequests() {
  const context = useContext(TradeRequestsContext);
  if (!context) {
    throw new Error(
      "useTradeRequests must be used inside a TradeRequestsProvider"
    );
  }
  return context;
}
