import React from "react";
import CopyClassCode from "./CopyToClipBoardButton/CopyClassCode.jsx";

export default function AddStudentsPopup({ closePopup, classCode }) {
    return (
        <div
            id="addStudentsPopup-container"
            onClick={(e) => e.stopPropagation()}
            className="w-[400px] bg-white p-[30px] rounded-[10px] shadow-standard flex flex-col gap-5 justify-center items-center"
        >
            <h2 className="w-full text-[28px] text-left text-black1 font-extrabold">Instructions</h2>
            <p className="text-[18px]">To add students, ask them to input this code under their class menu.</p>

            {/* Test for now */}
            <CopyClassCode classCode={classCode} />
            <button
                onClick={closePopup}
                className={`text-[20px] leading-5 text-white1 bg-bgBlue1 w-full py-5 
        rounded-lg font-semibold hover:scale-105
        transition-all duration-150`}
            >
                Back to Students
            </button>
        </div>
    );
}
