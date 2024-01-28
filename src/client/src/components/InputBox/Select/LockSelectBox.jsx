import React, { useState } from 'react';

export default function LockedSelectBox({ title, value, initialOption, options }) {

  const selectedOption = !options ? null : options.find((option) => option.id === initialOption);

  return (
    <div className="relative">
      <div className="absolute text-xs -top-3 left-3 text-black2 bg-white1 p-1 rounded">
        {title}
      </div>
      <div className={`text-black1 text-base rounded-lg border border-white3 p-2.5 pl-4 w-full cursor-pointer`}>
        {value && <p>{value}</p>}
        {selectedOption && (selectedOption.title || selectedOption.name)}
      </div>
    </div>
  );
}
