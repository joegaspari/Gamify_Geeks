import React from 'react';
import { PopupProvider } from '../context/PopupContext';
import { TooltipProvider } from '../context/HelpModeContext';
import { ProfileProvider } from '../context/ProfileContext';

function Providers({ children }) {
  return (
      <TooltipProvider>
        <PopupProvider>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </PopupProvider>
      </TooltipProvider>
  );
}
export default Providers;
