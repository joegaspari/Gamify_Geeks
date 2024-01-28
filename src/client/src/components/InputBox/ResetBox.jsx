import React, { useRef, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import SmallPencil from '../icon/pencil/SmallPencil';
import RightPureArrow from '../icon/arrow/RightPureArrow';

export default function ResetBox({
  value, onChange, id, title, confidential = false, error = false, errorMessage = "", link, type = "text"
}) {
  const handleLabelClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col w-full gap-2 ">
      <label htmlFor={id} className="text-sm text-black2" onClick={handleLabelClick}>
        {title}
      </label>
      <div className="w-full gap-3 flex items-center justify-between border-b border-white3 pb-2">
        <input
          id={id}
          name={id}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={confidential}
          className="w-full text-lg font-medium text-black1 align-middle outline-white3 bg-white1"
        />
        {
          !confidential
            ? (
              <label htmlFor={id} className=" cursor-pointer px-2 hover:scale-110 transition-all duration-150 hover:bg-bgBlue2 rounded-full h-7 flex justify-center items-center active:bg-blue2">
                <SmallPencil />
              </label>
            ) : (
              <Link to={link} className="flex items-center cursor-pointer px-2 h-7 rounded-2xl hover:bg-bgBlue2 hover:ps-5 hover:translate-x-1 hover:scale-105	 transition-all duration-150 active:bg-blue2">
                <RightPureArrow />
              </Link>
            )
        }
      </div>
      {error && (
        <div className="mt-2 text-xs text-bgRed1">{errorMessage}</div>
      )}
    </div>
  );
}
