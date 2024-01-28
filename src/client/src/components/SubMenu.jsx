import React from 'react';
import { Link } from 'react-router-dom';

export default function SubMenu({ item, path }) {
  const isCurrentPage = path === item.path;

  const styles = isCurrentPage
    ? 'bg-green1 font-medium xl:text-md text-white1'
    : 'text-white3 hover:bg-bgBlue1';

  return (
    <li className={`${styles} h-full transition duration-150 ease-in leading-3 flex items-center rounded-lg p-2`}>
      <Link id={item.title} to={item.path} className="flex flex-row gap-3 items-center w-full">
        <div className="w-1/6 aspect-square flex justify-center items-center transition duration-150 ease-in">
          {isCurrentPage ? item.icon.selected : item.icon.unSelected}
        </div>
        <p>{item.title}</p>
      </Link>
    </li>
  );
}
