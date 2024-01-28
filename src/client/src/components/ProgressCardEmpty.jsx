import React from "react";
import ProgressBar from "./ProgressBar";
import { useHelpMode } from "../context/HelpModeContext";
import "../index.css";
import HexagonImage from "./HexagonImage/HexagonImage";
import { Link } from "react-router-dom";

export default function ProgresssCardEmpty() {
    const colors = ["bgGreen", "bgBlue", "bgRed"];

    const item = {
        id: 1,
        title: "Python Hard Badge",
        progress: Math.floor(Math.random() * 20) + 1,
        difficulty: Math.floor(Math.random() * 3) + 1,
    };

    const { title, progress, objective, difficulty, id } = item;

    return (
        <div
            id={`milestone-${id}`}
            data-tooltip-id={`milestone-${id}-tooltip`}
            className={` relative z-0
                lockedCard
                ${1 <= difficulty <= 3 ? `bg-${colors[difficulty - 1]}3` : "bg-offWhite2"} 
                h-[360px]
                p-base
                rounded-[20px] overflow-hidden shadow-standard
                justify-between
            `}
        >
            <div className="absolute lockedDisplay w-full h-full flex justify-center items-center top-0 left-0">
                <Link to="/explore">
                    <button
                        className={`
                    w-[200px]
                    text-[20px]
                    shadow-md
                    hover:text-white1
                    transition-all duration-150
                    hover:font-semibold 
                    ${
                        1 <= difficulty <= 3
                            ? `hover:bg-${colors[difficulty - 1]}1
                        border-${colors[difficulty - 1]}1`
                            : "hover:bg-black2 border-black2"
                    }
                    border-2 rounded-[10px] text-center py-2
                `}
                    >
                        Get Exploring
                    </button>
                </Link>
            </div>
            {/* <img className="w-full h-28 ounded-lg" src="" alt="" /> */}
            <div className={`mask bg-${colors[difficulty - 1]}2 absolute -top-8 -right-6`} />
            <div className="flex flex-col w-full pt-1 gap-6 justify-between h-full">
                <div className="flex flex-col gap-2">
                    <HexagonImage resize={5 / 4} borderColor={`bg-${colors[difficulty - 1]}2`} />
                    <h2 className="p-0 lg:text-xl font-semibold">{title}</h2>
                </div>
                <div className="flex flex-col justify-between gap-10">
                    <div className="flex flex-col gap-2 h-fit">
                        <div className="flex flex-row justify-between lg:text-base lg:leading-7">
                            <p>{progress ? "progress" : "Haven't started"}</p>
                            {progress !== 0 && (
                                <p>
                                    {progress} / {objective}
                                </p>
                            )}
                        </div>
                        <ProgressBar progress={progress} difficulty={difficulty} numChunks={5} chunkSize={objective / 5} />
                    </div>
                    <button
                        className={`
                            text-[20px]
                            shadow-md
                            hover:text-white1
                            transition-all duration-150
                            hover:font-semibold 
                            ${
                                1 <= difficulty <= 3
                                    ? `hover:bg-${colors[difficulty - 1]}1
                                border-${colors[difficulty - 1]}1`
                                    : "hover:bg-black2 border-black2"
                            }

                            border-2 rounded-[10px] text-center py-2
                        `}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

// Enables Tailwind Dynamic Styling DO NOT REMOVE

const possible = [
    "hover:bg-bgGreen1",
    "hover:bg-bgBlue1",
    "hover:bg-bgRed1",
    "bg-bgGreen2",
    "bg-bgBlue2",
    "bg-bgRed2",
    "bg-bgGreen3",
    "bg-bgBlue3",
    "bg-bgRed3",
    "border-bgGreen1",
    "border-bgBlue1",
    "border-bgRed1",
];
