import React from "react";
import Leaderboard from "./Leaderboard";
import HexagonImage from "./HexagonImage/HexagonImage";
import { useHelpMode } from "../context/HelpModeContext";
import { useNavigate } from "react-router-dom";

export default function ToggleCard({ items, toggle, isToggled, dependancy }) {
    const { isHelpModeActive } = useHelpMode();
    const { badges: firstItems, leaderboardItems: secondItems } = dependancy;

    const navigate = useNavigate();
    const handleUserRowClick = (userId) => {
        navigate(`/dashboard/students/${userId}`);
    };

    return (
        <div className={`${isHelpModeActive && "hasHelp"} flex flex-col h-full shadow-standard rounded-[20px] overflow-hidden max-h-[400px]`}>
            <div
                className="
            flex items-start
            bg-white1
            rounded-xl rounded-b-none"
            >
                {items.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={toggle}
                        disabled={!isToggled === (index === 0)}
                        className={`
                    h-14
                    w-full p-4 pb-0
                    ${index == 0 ? "rounded-tl-2xl" : "rounded-tr-2xl"}
                    ${!isToggled !== (index == 0) ? (index == 0 ? "rounded-br-2xl" : "rounded-bl-2xl") : index == 1 ? "rounded-tl-2xl" : "rounded-tr-2xl"}
                    ${!isToggled !== (index == 0) ? "bg-gray-200 shadow-inner hover:shadow-none hover:bg-bgGreen2" : "bg-white1"}
                    transition-all duration-150 ease-in-out
                    `}
                    >
                        <h1
                            className={`
                    
                    ${
                        !isToggled === (index == 0)
                            ? "text-black1 lg:text-2xl md:text-xl text-2xl"
                            : "text-black2 lg:text-lg md:text-base text-lg hover:scale-110"
                    }
                    font-semibold
                    transition-all duration-150 ease-in-out
                    `}
                        >
                            {item.title}
                        </h1>
                    </button>
                ))}
            </div>
            <div className="bg-white1 rounded-xl rounded-t-none p-base overflow-y-scroll scroll-hidden max-h-full">
                {!isToggled && firstItems && (
                    <div className="rounded-2xl max-h-full scroll-hidden overflow-x-hidden overflow-y-auto badgeHexes">
                        {firstItems.map((item) => (
                            <div key={item.badgeId} className="badge">
                                <HexagonImage profileImg={item.iconpath} />
                            </div>
                        ))}
                        {
                            // Create an array of the size difference between 9 and firstItems.length
                            // and map over it to create the filler HexagonImage components
                            // [...Array(9 - firstItems.length)].map((_, index) => (
                            //     <div key={`filler-${index}`} className="badge">
                            //         <HexagonImage />
                            //     </div>
                            // ))
                        }
                    </div>
                )}
                {isToggled && secondItems && (
                    <div className=" rounded-[20px] h-full overflow-hidden">
                        <Leaderboard LeaderboardItems={secondItems} handleUserRowClick={handleUserRowClick} />
                    </div>
                )}
            </div>
        </div>
    );
}
