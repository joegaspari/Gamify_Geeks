import React from 'react';

function LandingContentBox({ children }) {
  return (
    <div id='landingBox' className="w-full flex bg-gray-50" style={{ height: 'calc(100vh - 80px)' }}>
      {children}
    </div>
  );
}

export default LandingContentBox;
