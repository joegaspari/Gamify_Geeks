import React from "react";
import SearchIcon from "../icon/SearchIcon";

export default function Searchbar({ title, placeholder, onSearchChange, search, size = "base", showLabel = true }) {
    return (
        <div className="relative w-full ">
            {title && showLabel && (
                <label
                    htmlFor={`search_${title}`}
                    className={`absolute  text-black2 bg-white1 p-1 left-3 rounded
                ${size === "large" ? " -top-3 text-sm" : size === "small" ? "-top-2.5 text-[10px]" : "-top-3 text-xs"}`}
                >
                    {title}
                </label>
            )}
            <input
                type="search"
                name={`search_${title}`}
                id={`search_${title}`}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchChange(e.target.value)}
                placeholder={placeholder}
                className={`text-black1  rounded-lg border border-white3 w-full pl-4
                ${size === "large" ? "p-3 p2-14 text-lg" : size === "small" ? "p-2 pe-10 text-sm" : "p-2.5 pe-12 text-base"}
            outline-none
            `}
            />
            <div
                onClick={() => onSearchChange(search)}
                className="absolute top-0 right-1 h-full flex items-center justify-center aspect-square cursor-pointer ease-in"
            >
                <SearchIcon />
            </div>
        </div>
    );
}
