import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

const HelpModeContext = createContext({});

export function TooltipProvider({ children }) {
  const [isHelpModeActive, setHelpMode] = useState(false);

  const toggleHelpMode = () => {
    setHelpMode((prev) => !prev);
  };

  const context = useMemo(
    () => ({
      isHelpModeActive,
      toggleHelpMode,
    }),
    [isHelpModeActive, toggleHelpMode],
  );

  return (
    <HelpModeContext.Provider value={context}>
      {
        children
      }
    </HelpModeContext.Provider>
  );
}

export default HelpModeContext;
export const useHelpMode = () => useContext(HelpModeContext);
