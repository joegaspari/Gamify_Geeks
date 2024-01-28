import React, { useEffect, useState } from "react";
import styles from "./SelectBox.module.css";

export default function SelectBox({ handleOption, initialOption = 0, options, title, needAll = false, useName = false }) {
    // const [selectedOption, setSelectedOption] = useState(initialOption);

    const handleSelectChange = (event) => {
        // setSelectedOption(event.target.value);
        // TODO: when you integrate with server, unify key name you will use
        handleOption(event.target.value);
        // console.log(event.target.value);
    };

    return (
        <div className="selectBox relative">
            <label htmlFor={title} className="absolute text-xs -top-3 left-3 text-black2 bg-white1 p-1 rounded">
                {title}
            </label>
            <select
                id={`${title}-Select`}
                name={title}
                value={initialOption}
                onChange={handleSelectChange}
                className={`
        text-black1 text-base rounded-lg border border-white3 p-2.5 pl-4 w-full cursor-pointer ${styles.customSelect}`}
            >
                {!initialOption && <option value={-1}>{`--Select Option--`}</option>}
                {needAll && <option value={0}>All</option>}
                {options &&
                    options.map((option) => (
                        <option key={option.id} value={useName ? option.name : option.id}>
                            {option.title || option.name}
                        </option>
                    ))}
            </select>
            {/* TODO: when you integrate with server, unify key name you will use */}
        </div>
    );
}
