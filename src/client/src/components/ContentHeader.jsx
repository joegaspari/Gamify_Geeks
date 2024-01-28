import React from 'react';

export default function ContentHeader({
  title, subtitle, icons, children, resizeIcon = 1, childrenWidth = '1/2',
}) {
  const h = `${resizeIcon * 60}px`;

  return (

    <header className="flex flex-row justify-between items-center gap-6">
      <div className="flex flex-col w-full gap-2">
        <h1 id="pageTitle" className="font-bold text-[36px] leading-[36px] text-black1">{title}</h1>
        <p className="text-black2 lg:text-[18px] leading-[18px] ">{subtitle}</p>
      </div>
      <div className="flex justify-end sm:flex-nowrap flex-wrap">
        <div className="flex flex-row items-center justify-end gap-6 w-1/5">
          {icons.map((icon) => (
            <button
              id={icon.elemId}
              key={icon.id}
              onClick={icon.onClick}
              className={`${icon.aboveOverlay ? 'aboveOverlay' : ''} shadow-standard rounded-[20px] bg-white1 aspect-square flex justify-center items-center hover:scale-105 transition-all ease-in duration-150 active:shadow-inner active:bg-white3`} style={{ height: h }}>
              {icon.tag}
            </button>
          ))}
        </div>
        {
          children && (
            <button className="w-fit p-5 rounded-[20px] bg-white1 shadow-standard ms-6 flex items-center justify-center gap-5 text-xl hover:scale-105 transition-all ease-in duration-150 active:shadow-inner active:bg-white3" style={{ height: h }}>
              {children}
            </button>
          )
        }
      </div>
    </header>
  );
}
