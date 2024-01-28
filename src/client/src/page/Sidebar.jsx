import React from 'react';

function Sidebar({ children, styles }) {
  return (
    <div
      id="sideContent"
      className={`flex flex-col items-stretch p-lg pl-base gap-base bg-offWhite2 top-0 lg:sticky lg:overflow-y-scroll scroll-hidden lg:h-screen grow-0 shrink-0
        2xl:w-[500px] lg:w-[360px] w-full lg:right-0 h-fit  ${styles}`}
      >
      {children}
    </div>
  );
}

export default Sidebar;
