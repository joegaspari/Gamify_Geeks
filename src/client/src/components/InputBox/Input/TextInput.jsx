import React from "react";

export default function TextInput({ title, textValue, setTextValue, placeholder = "", disabled }) {
    // const [selectedOption, setSelectedOption] = useState(initialOption);

    const handleSelectChange = (event) => {
        setTextValue(event.target.value);
    };

    return (
        <div className="selectBox relative">
            <label htmlFor={title} className="absolute text-xs -top-3 left-3 text-black2 bg-white1 p-1">
                {title}
            </label>
            <input
                name={title}
                className={`
          text-base text-black1
          rounded-lg
          border border-white3 p-[10px] pl-4
          w-full
        `}
                onChange={handleSelectChange}
                value={textValue}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
}
