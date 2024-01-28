import React from "react";

export default function AchievementCard({ item, description }) {
    const { rate, num } = item;
    const { title, icon } = description;

    const parsedRate = parseFloat(rate);
    const formattedRate = parsedRate.toFixed(Math.min(3, parsedRate.toString().split(".")[1]?.length || 0));
    return (
        <div className="bg-white1 border border-white3 rounded-lg  p-3 px-4 flex justify-between">
            <div className="flex flex-col justify-between gap-3 w-full">
                <div className={`flex justify-between`}>
                    <p className="text-black2 text-sm ">{title}</p>
                    <div>{icon}</div>
                </div>
                <div className="flex gap-4 items-center">
                    <h1 className="text-black1 text-3xl  leading-7 font-semibold truncate">{formattedRate}</h1>
                    <p
                        className={`rouned-lg text-base font-semibold px-2 rounded-md	
                        ${num > 0 ? "bg-bgGreen2 text-bgGreen1" : num < 0 ? "bg-bgRed2 text-bgRed1" : "bg-white3 text-black"}`}
                    >
                        {num > 0 && "+"}
                        {num}
                    </p>
                </div>
            </div>
        </div>
    );
}
