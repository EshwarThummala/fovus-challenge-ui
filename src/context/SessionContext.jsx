import { createContext, useState, useContext } from "react";

const SessionContext = createContext();

export function SessionContextProvider({ children }) {
  const [tokens, setTokens] = useState({});
  const [userName, setUsername] = useState();

  return (
    <SessionContext.Provider
      value={{ tokens, setTokens, userName, setUsername }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export default function useSessionContext() {
  return useContext(SessionContext);
}
