import React from 'react';

function MainContent({ children, styles }) {
  return (
    <div className="grow">
      <div
        id="mainContent"
        className={`flex flex-col  p-[40px] pr-[30px]
          grow
          max-w-[1120px]
          min-h-screen
          mx-auto
          gap-base
          ${styles}`}
      >
        {children}
      </div>   
    </div>
  );
}

export default MainContent;

// lg:w-[70%] w-full
// 2xl:w-[1200px] 