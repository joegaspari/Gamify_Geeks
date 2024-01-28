import React, {
  createContext, useContext, useMemo, useState,
} from 'react';

export const NeedAccountContext = createContext({});

export function NeedAccountProvider({ children }) {
  const [needAccount, setNeedAccount] = useState(false);

  const contextValue = useMemo(() => ({
    needAccount,
    setNeedAccount,
  }), [needAccount]);

  return (
    <NeedAccountContext.Provider value={contextValue}>
      {children}
    </NeedAccountContext.Provider>
  );
}

export const useNeedAccount = () => useContext(NeedAccountContext);
