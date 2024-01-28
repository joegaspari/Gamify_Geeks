import React from "react";

export default function PasswordPopup({}) {
    return (
        <div className="w-fit h-fit bg-white p-[30px] rounded-[10px] shadow-standard flex flex-col gap-5 justify-center items-center">
            <p className="w-full text-xl text-left text-black1 font-extrabold">Password Must:</p>

            <ul className="text-sm font-regular text-black1 list-disc ml-5">
                <li className="whitespace-nowrap">Contain 8-24 Characters</li>
                <li className="whitespace-nowrap">Contain 1+ Special Character</li>
                <li className="whitespace-nowrap">Use only Alphanumeric Characters</li>
            </ul>
        </div>
    );
}
