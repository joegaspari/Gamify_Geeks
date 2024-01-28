import React, { useEffect, useState } from "react";
import styles from "./SelectBox.module.css";

export default function FloatingSelectBox({ onChange, options, selectedOption }) {
    const handleChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <select value={selectedOption} onChange={handleChange}>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.title}
                </option>
            ))}
        </select>
    );
}
