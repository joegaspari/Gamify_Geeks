import React, { useEffect, useState } from "react";

import WarningIcon from "../../icon/WarningIcon";
import Info from "../../icon/info/Info";

export default function LoginTextInput({
    placeholder,
    label,
    type,
    required = false,
    onChange,
    value,
    autoComplete,
    tooltip = null,
    error = false,
    errorMessage = "",
    isEmailTyped = false,
    handleSendCode,
    isCodeSent = false,
}) {
    const onSendCodeBtnClick = () => {
        handleSendCode();
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col w-full border-b border-white3 pb-2.5">
                <div className="flex gap-2">
                    <label
                        className={`
              text-sm	
              text-black2
              `}
                        htmlFor={label}
                    >
                        {label}
                    </label>
                    {tooltip && (
                        <>
                            <div data-tooltip-id={`${tooltip.id}-tooltip`} className="cursor-pointer aspePct-square h-full flex items-center">
                                <Info size={16} />
                            </div>
                            {tooltip.element}
                        </>
                    )}
                </div>
                <div className="flex items-center justify-between gap-5 pt-5">
                    <input
                        id={label}
                        className={`
                  w-full
                  bg-transparent
                  outline-none
                  
                  font-medium
                  text-md	
                  placeholder-black1
                  `}
                        type={type}
                        placeholder={placeholder}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        autoComplete={autoComplete}
                    />
                    {required && !value && (
                        <div
                            className={`
                  flex justify-between items-center gap-1
                  `}
                        >
                            <p className="text-red-500 text-xs">Required</p>
                            <WarningIcon />
                        </div>
                    )}
                </div>
            </div>
            {isEmailTyped && (
                <div
                    className={`
                  flex justify-center items-center gap-1
                  rounded-md px-4 py-1
                  bg-white1 border border-black2
                  active:bg-white3 active:shadow-inner
                  hover:bg-slate-200 transition-all duration-150 ease-in
                  cursor-pointer text-center align-middle
                  `}
                    onClick={onSendCodeBtnClick}
                >
                    <p className="text-xs">{isCodeSent ? "Resend Code" : "Send Code"}</p>
                </div>
            )}
            {error && (
                <div id={`${label}-Error`} className="text-xs text-bgRed1">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}
