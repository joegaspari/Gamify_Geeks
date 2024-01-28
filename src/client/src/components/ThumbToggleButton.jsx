import React, { useState } from "react";

export default function ThumbToggleButton({ size }) {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    let buttonSize;
    let innerSize;

    switch (size) {
        case "small":
            buttonSize = "w-8 h-4";
            innerSize = "w-3 h-3";
            break;
        case "large":
            buttonSize = "w-16 h-8";
            innerSize = "w-6 h-6";
            break;
        default:
            buttonSize = "w-12 h-6";
            innerSize = "w-5 h-5";
            break;
    }

    return (
        <div
            className={`rounded-full focus:outline-none relative transition-colors duration-300 ${buttonSize} ${isToggled ? "bg-green-400" : "bg-gray-300"}`}
            onClick={handleToggle}
        >
            <span
                className={`rounded-full absolute left-1 top-1 transition-transform duration-300 transform ${innerSize} ${
                    isToggled ? "translate-x-full" : "translate-x-1"
                } bg-white`}
            />
        </div>
    );
}
