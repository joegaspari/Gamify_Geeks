import React from 'react';

export default function TooltipItems({ items = [] }) {
  return (
    <>
        {items && items.map((item, index) => (
            <div className="tooltip-card" style={{ animationDelay: `${index * 0.2}s` }} key={item.id}>
            <h2 className="p-0 m-0 text-2xl font-bold leading-6">{item.title}</h2>
            <p className="p-0 m-0 text-sm font-regular">{item.content}</p>
            </div>
        ))}
    </>
  );
}
