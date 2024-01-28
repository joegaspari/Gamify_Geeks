import React, { useState } from 'react';

export default function SmallToggleButton({titles, handleToggle}) {
  const [isToggled, toggle] = useState(false);

  const onToggle = () => {
    toggle(!isToggled);
    handleToggle();
  };

  return (
    <div id='toggleBtn' className={`p-1  w-64 h-14 transition-all duration-300 ease-in-out  ${isToggled ? 'bg-bgBlue1' : 'bg-bgGreen1'} rounded-full shadow-inner `}>
        <label className={`relative inline-block w-full h-full cursor-pointer `}>
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={isToggled} 
          onChange={onToggle} 
        />
        <div className={`flex w-full h-full font-light text-white text-lg `}>
          <div className="w-1/2 h-full flex justify-center items-center">{titles[0]}</div>
          <div className="w-1/2 h-full flex justify-center items-center">{titles[1]}</div>
        </div>
        <div 
          id='currentToggle'
          className={`w-1/2 h-full p-2
            absolute top-0 left-0 right-0 bottom-0  
            transition-all duration-300 ease-in-out 
            bg-white1 border flex items-center justify-center
            shadow-lg rounded-full
            ${isToggled  ? 'transform translate-x-full' : ''}
            text-black1 font-semibold
            text-xl
            `}
        >
          {!isToggled? titles[0]:titles[1]}
        </div>
      </label>
    </div>
  );
}


