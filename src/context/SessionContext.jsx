import { createContext, useState, useContext } from "react";

const SessionContext = createContext();

export function SessionContextProvider({ children }){
    const [tokens, setTokens] = useState({})

    return (<SessionContext.Provider value={{tokens, setTokens}}>
        {children}
    </SessionContext.Provider>);
 
}

export default function useSessionContext(){
    return useContext(SessionContext);
}