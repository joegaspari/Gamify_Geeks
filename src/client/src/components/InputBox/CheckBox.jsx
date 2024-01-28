import React, { useState, useEffect } from 'react';
import SmallCheck from '../icon/check/SmallCheck';

export default function CheckBox({
  title, initial, categories, handleCheckBox,
}) {
  const [items, setItems] = useState(categories);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    setCheckedItems(initial || {});
  }, [initial]);

  const handleCheckChange = (event, itemId) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [itemId]: event.target.checked,
    }));
  };

  useEffect(() => {
    // handleCheckBox(checkedItems);

  }, [checkedItems]);

  return (
    <div className="flex items-center w-full flex-wrap gap-6 mt-6">
      {items.map((item) => {
        const id = `${item.id}_${title}`;

        return (
          <div key={item.id} className="flex items-center gap-3">
            <input
              id={id}
              name={item.title}
              type="checkbox"
              checked={checkedItems[item.id] || false}
              onChange={(event) => handleCheckChange(event, item.id)}
              className="hidden"
            />
            <label
              htmlFor={id}
              className={` cursor-pointer
                                h-5 aspect-square rounded-md border border-white3 
                                ${checkedItems[item.id] ? 'bg-blue-500 hover:bg-blue-600' : 'bg-bgBlue3 hover:bg-bgBlue2'}
                            `}
            >
              {
                                checkedItems[item.id] && (
                                <SmallCheck />
                                )
                            }
            </label>
            <label
              htmlFor={id}
              className="font-medium text-black1 text-base"
            >
              {item.title}
            </label>
          </div>
        );
      })}
    </div>
  );
}
