import React, { useState, useEffect, Children } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useHelpMode } from '../context/HelpModeContext';

export default function Tooltip({ id, tooltip, place = 'right-start', forHelpMode = false, clickable = false, offset = 30, openOnClick = false, manageOpen = false, isOpen = false}) {
  const { isHelpModeActive } = useHelpMode();

  // TODO: Change to tailwind
  const tooltipStyles = {
    zIndex: 200,
    backgroundColor: 'transparent',
    opacity: 1,
    margin: '0',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    position: 'absolute'
  };

  return (
    <>
      {
        ((forHelpMode && isHelpModeActive) || (!forHelpMode && !isHelpModeActive)) &&
        <>
          {manageOpen ? (
            <ReactTooltip
              openOnClick={openOnClick}
              id={`${id}-tooltip`}
              place={place}
              style={tooltipStyles}
              offset={offset}
              noArrow
              clickable={clickable}
              isOpen={isOpen}
            >
              {tooltip}
            </ReactTooltip>
          ) : (
            <ReactTooltip
              openOnClick={openOnClick}
              id={`${id}-tooltip`}
              place={place}
              style={tooltipStyles}
              offset={offset}
              noArrow
              clickable={clickable}
            >
              {tooltip}
            </ReactTooltip>
          )}
        </>
      }
    </>
  );
}
