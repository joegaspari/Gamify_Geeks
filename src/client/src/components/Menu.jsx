import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function Menu({title, path, items, paramId }) {
  const menuDiv = useCallback(() => items.map((item) => {
    const pathParts = item.path.split('/');
    if (paramId) {
      pathParts.splice(2, 0, paramId);
    }
    const link = pathParts.join('/');

    const isCurrentPage = path === link || path.includes(item.path) || (item.index && path === '/');

    const styles = isCurrentPage
      ? 'bg-green1 font-semibold xl:text-lg'
      : 'text-white3 hover:bg-bgBlue1';

    return (
      <li className={`${styles} transition duration-150 ease-in leading-4 flex items-center rounded-lg px-2 py-2`} key={item.id}>
        <Link id={item.title} to={link} className="flex flex-row w-full h-full items-center gap-2">
          <div className="w-1/6 aspect-square flex justify-center items-center transition duration-150 ease-in">
            {isCurrentPage ? item.icon.selected : item.icon.unSelected}
          </div>
          <p>{item.title}</p>
        </Link>
      </li>
    );
  }), [items, path, paramId]);

  return (
    <>
      <h2 className="block font-semibold text-lg pb-5">
        {title}
      </h2>
      <ol className="flex flex-col gap-1">
        {menuDiv()}
      </ol>
    </>
  );
}
