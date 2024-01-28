import React from "react";

export default function ConfirmReset({ confirmReset, cancelReset }) {
    return (
        <div
            id="confirmReset-container"
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 px-10 rounded-xl shadow-2xl flex flex-col gap-5 justify-center items-center"
        >
            <p className="text-2xl text-black1 font-extrabold">Reset Answer?</p>
            <button
                id="confirmResetBtn"
                onClick={confirmReset}
                className="text-base text-white1 bg-bgGreen1 px-16 py-3 rounded-lg font-semibold active:bg-green-800 hover:scale-110 transition-all duration-150"
            >
                Yes, Reset My Answer
            </button>
            <button
                id="cancelResetBtn"
                onClick={cancelReset}
                className="text-sm text-black2 font-semibold hover:bg-white3 px-10 py-1 rounded-lg transition-all duration-150 hover:scale-110 active:bg-gray-700"
            >
                No, Keep My Answer
            </button>
        </div>
    );
}
