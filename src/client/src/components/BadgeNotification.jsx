import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import HexagonImage from "./HexagonImage/HexagonImage";

export default function BadgeNotification({ data, handleClaimBadge }) {
    const onClickClaimBtn = () => {
        handleClaimBadge(data);
    };

    return (
        <div id={`notification-${data.id}`} className="flex gap-4 justify-between w-full">
            <div>
                <HexagonImage resize={8 / 11} borderColor={`bg-${colors[data.difficulty - 1]}`} />
            </div>
            <div className="flex flex-col gap-2 w-full pr-4">
                <p className="text-sm w-fit text-left text-black1">
                    You have received the <span className="font-bold">{data.badgeTitle}</span>
                </p>
                <p className="text-xs w-fit text-black2">{`${data.date} | ${data.type || ""}`}</p>
            </div>
            <div
                className={`bg-${colors[data.difficulty - 1]} claimBtn h-fit text-white1 font-semibold rounded-md px-4 py-1
            hover:scale-105  active:shadow-inner active:bg-white3 
            cursor-pointer
            `}
                onClick={onClickClaimBtn}
            >
                Claim
            </div>
        </div>
    );
}

const colors = ["bgGreen1", "bgBlue1", "bgRed1"];
const hoverColors = ["bgGreen2", "bgBlue2", "bgRed2"];
