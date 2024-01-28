import React from "react";
import ProgressBar from "./ProgressBar";
import { useHelpMode } from "../context/HelpModeContext";
import "../index.css";
import HexagonImage from "./HexagonImage/HexagonImage";

export default function ProgressCard({ item, status, onClick }) {
    const colors = ["bgGreen", "bgBlue", "bgRed"];
    const { badgePath } = item;
    const iconPath = item.iconPath && `url(${item.iconPath})`;

    const { title, progress, id, objective } = item;
    const difficulty = item.proficiencyLevelId || 0;
    const { isHelpModeActive } = useHelpMode();

    return (
        <div
            id={`milestone-${id}`}
            data-tooltip-id={`milestone-${id}-tooltip`}
            className={` ${isHelpModeActive && "hasHelp"} relative z-0
      
            ${1 <= difficulty && difficulty <= 3 ? `bg-${colors[difficulty - 1]}3` : "bg-offWhite2"}
            h-[360px]
            p-base
            rounded-[20px] overflow-hidden shadow-standard
            justify-between
        `}
        >
            {/* <img className="w-full h-28 ounded-lg" src="" alt="" /> */}
            <div className={`mask bg-${colors[difficulty - 1]}1 absolute -top-8 -right-6`} style={{ maskImage: iconPath, WebkitMaskImage: iconPath }} />
            <div className="flex flex-col w-full pt-1 gap-6 justify-between h-full">
                <div className="flex flex-col gap-2">
                    <HexagonImage profileImg={badgePath} resize={5 / 4} borderColor={`bg-${colors[difficulty - 1]}2`} />
                    <h2 className="p-0 lg:text-xl font-semibold">{title}</h2>
                </div>
                <div className="flex flex-col justify-between gap-10">
                    <div className="flex flex-col gap-2 h-fit">
                        <div className="flex flex-row justify-between lg:text-base lg:leading-7">
                            <p>{progress ? "progress" : "Haven't started"}</p>
                            {progress !== 0 && (
                                <p>
                                    {progress}/{objective}
                                </p>
                            )}
                        </div>
                        <ProgressBar progress={progress} difficulty={difficulty} numChunks={5} chunkSize={objective / 5} />
                    </div>
                    <button
                        onClick={onClick ? onClick : () => {}}
                        className={`
                        text-[20px]
                        shadow-md
                        hover:text-white1
                        transition-all duration-150
                        hover:font-semibold 
                        ${
                            1 <= difficulty && difficulty <= 3
                                ? `hover:bg-${colors[difficulty - 1]}1
                            border-${colors[difficulty - 1]}1`
                                : "hover:bg-black2 bg-white3 border-black2 hover:text-black2"
                        }

                        border-2 rounded-[10px] text-center py-2
                    `}
                    >
                        {progress == 20 ? status[2] : progress == 0 ? status[0] : progress && status[1]}
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
