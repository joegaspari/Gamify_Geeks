import React, {
  createContext, useState, useCallback, useContext, useMemo,
} from 'react';

export const PopupContext = createContext({});


//Currently, this context isn't used since we separated sign up and sign in page into two different pages
export function PopupProvider({ children }) {
  // Use an object to store the open state of each popup
  const [popups, setPopups] = useState({});

  const openPopup = useCallback((id) => {
    setPopups((prev) => ({ ...prev, [id]: true }));
  }, []);

  const closePopup = useCallback((id) => {
    setPopups((prev) => ({ ...prev, [id]: false }));
  }, []);

  const context = useMemo(() => ({
    popups,
    openPopup,
    closePopup,
  }), [popups, openPopup, closePopup]);

  return (
    <PopupContext.Provider value={context}>
      {children}
    </PopupContext.Provider>
  );
}

export const usePopup = () => useContext(PopupContext);
