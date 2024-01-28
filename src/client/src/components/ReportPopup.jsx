import React from 'react';

export default function ReportPopup({ closePopup, handleReportQuestion}) {

  const handleReport = () => {
    closePopup();
    handleReportQuestion();
  }
  return (
    <div id='reportPopupContainer' onClick={(e) => e.stopPropagation()} 
      className="w-[500px] bg-white p-[30px] rounded-[10px] shadow-standard flex flex-col gap-5 justify-center items-center">

      <p className="w-full text-[28px] text-left text-black1 font-extrabold">What Happened?</p>

      {/* Test for now */}
      <textarea className='h-[200px] w-full border rounded-xl border-white3 p-5 text-lef'/>
      <button onClick={handleReport}
        className={`text-[20px] leading-5 text-white1 bg-bgRed1 w-full py-5 
        rounded-lg font-semibold hover:scale-105
        transition-all duration-150`}>
        Report
      </button>
    </div>
  );
}
