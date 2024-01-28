import React from "react";
import HexagonImage from "./HexagonImage/HexagonImage";
import RedHexaIcon from "./icon/RedHexaIcon";
import SmallFireIcon from "./icon/fireIcon/SmallFireIcon";
import { useHelpMode } from "../context/HelpModeContext";

const defaultBannerImg = "https://via.placeholder.com/1200x300/808080/808080";
const defaultBannerImg2 = process.env.PUBLIC_URL + "/image/defaultBannerImg.png";

export default function Profile({ profile, totalStreaks }) {
    const { isHelpModeActive } = useHelpMode();

    const { bannerImg, profileImg, title, level, streakDays, username } = profile;

    return (
        <div className={`${isHelpModeActive && "hasHelp"} flex flex-col justify-between items-center bg-white1 rounded-[20px] overflow-hidden shadow-standard`}>
            <img className=" w-full h-[5rem] object-cover" src={bannerImg ?? defaultBannerImg2} alt="Profile Banner" />
            <div className=" w-full flex flex-col justify-center items-center">
                <HexagonImage profileImg={profileImg} hasContainer roundingUp />
                <h1 className="text-2xl	font-semibold text-center text-black1">{username}</h1>
                <p className="text-xs text-black1">{title}</p>
                <div className="h-full flex justify-center items-center gap-3 lg:flex-row flex-col w-full font-semibold p-sm">
                    <div className="text-sm leading-4 w-full h-full flex gap-2 items-center rounded-lg bg-bgBlue3 text-bgBlue1 p-2">
                        <RedHexaIcon />
                        <p>{`Level ${level}`}</p>
                    </div>
                    <div className="text-sm leading-4 w-full flex gap-2 items-center rounded-lg	bg-bgRed3 text-bgRed1 p-2">
                        <SmallFireIcon />
                        <p>{`${totalStreaks ?? 0} Day Streak`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
