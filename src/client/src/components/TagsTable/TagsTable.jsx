import React, { useEffect, useState } from 'react';
import styles from './TagsTable.module.css';

export default function TagsTable({
  title, items, theme = 'default', handleCheckBox, icon = false, checkedItems
}) {
  const handleCheckBoxChange = (event, id) => {
    const isChecked = event.target.checked;
    const numericId = parseInt(id);

    if (isChecked) {
      handleCheckBox([...checkedItems, numericId]);
    } else {
      const updatedItems = checkedItems.filter((_id) => _id !== numericId);
      handleCheckBox(updatedItems);
    }
  };


  return (
    <div>
      <h1 className="font-semibold text-black1 text-2xl pb-sm">{title}</h1>
      <div id={`${title}-tags-container`} className="flex flex-row items-center flex-wrap text-base text-black1 gap-2">
        {items && items.map((item) => {
          const id = `${item.id}_${title}`;
          const iconPath = item.iconPath && `url(${item.iconPath})`;

          return (
            <button key={item.id} className="flex justify-center items-center">
              <input
                id={id}
                name={item.name}
                type="checkbox"
                className="hidden"
                checked={checkedItems.includes(item.id)}
                onChange={(event) => handleCheckBoxChange(event, item.id)}
              />
              <label
                id={`${item.name}-${title}`}
                htmlFor={id}
                className={`flex gap-2 border border-white3 rounded-lg cursor-pointer py-2 px-3 ${!checkedItems.includes(item.id)
                  ? 'bg-white1 text-black1'
                  : theme === 'RGB'
                    ? `${item.id == '1' && 'bg-bgGreen3 text-bgGreen1'} 
                                ${item.id == '2' && 'bg-bgBlue3 text-bgBlue1'} 
                                ${item.id == '3' && 'bg-bgRed3 text-bgRed1'} `
                    : 'bg-bgBlue3 text-bgBlue1'
                  } transition-all duration-150 ease-in-out hover:scale-105`}
              >
                {iconPath && (
                  icon && (checkedItems.includes(item.id)) ? (
                    <div className={`${styles.mask2} bg-bgBlue1`} style={{ "maskImage": iconPath, "WebkitMaskImage": iconPath }} />
                  ) : (
                    <div className={`${styles.mask2} bg-black1`} style={{ "maskImage": iconPath, "WebkitMaskImage": iconPath }} />
                  )
                )
                }
                {item.name}
              </label>
            </button>
          );
        })}
      </div>
    </div>
  );
}
