import React from 'react';

export default function ToggleButton({ items, isToggled, toggle }) {
  return (
    <div className="flex lg:flex-row lg:justify-between text-md font-semibold gap-3">
      {items && items.map((item, index) => (
        <button
          id={item.title}
          key={item.id}
          className={
                `rounded-[20px] py-5 flex justify-center w-1/2 font-semibold text-[20px]
                ${!isToggled === (index === 0) ? 'bg-white1 shadow-standard text-black1 '
                  : 'text-black2 hover:scale-110 duration-150 ease-in-out'}`
}
          onClick={toggle}
          disabled={!isToggled === (index === 0)}
        >
          {item.title}
        </button>
      ))}
    </div>
  );
}