import React from 'react';

export default function HintPopup({ closePopup, hint }) {

  return (
    <div id='hintPopupContainer' onClick={(e) => e.stopPropagation()} 
      className="w-[500px] bg-white p-[30px] rounded-[10px] shadow-standard flex flex-col gap-5 justify-center items-center">

      <p className="w-full text-[28px] text-left text-black1 font-extrabold">Here's a Hint!</p>

      {/* Test for now */}
      <div className='h-fit w-full border rounded-xl border-white3 p-5 text-left whitespace-pre-line'>
        <p id='feedback'>{hint}</p>
      </div>
      <button onClick={closePopup}
        className={`text-[20px] leading-5 text-white1 bg-bgBlue1 w-full py-5 
        rounded-lg font-semibold hover:scale-105
        transition-all duration-150`}>
        Back to Question
      </button>
    </div>
  );
}
