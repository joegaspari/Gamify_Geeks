import React from "react";

const levelColors = [
    "#787878", // Grey
    "#F94144", // Red
    "#F3722C", // Orange
    "#F8961E", // Yellow
    "#F9C74F", // Light Yellow
    "#90BE6D", // Light Green
    "#43AA8B", // Turquoise
    "#4D908E", // Teal
    "#577590", // Sky Blue
    "#277DA1", // Blue
    "#9B00FF", // Violet
];

const lightLevelColors = [
    "#C8C8C8", // Light Grey
    "#FCA5A5", // Light Red
    "#FDBA74", // Light Orange
    "#FDE68A", // Light Yellow
    "#FEF3C7", // Lighter Yellow
    "#D1E8D1", // Light Green
    "#A5C3C6", // Light Turquoise
    "#B4C5D2", // Light Teal
    "#A3C1DE", // Light Sky Blue
    "#9FC2E8", // Light Blue
    "#E6B0FF", // Light Violet
];

const emptyColor = "#C8C8C8";

export default function PracticeCard({ item, theme = null }) {
    const levelBars = [];
    for (let i = 1; i <= 10; i++) {
        const barColor = i <= item.level ? (theme && levelColors[i]) || "#1A8CE0" : (theme && emptyColor) || "#CDE7FE";
        const borderColor = levelColors[i] || "#1A8CE0";
        levelBars.push(
            <div
                key={i}
                className={`rounded-full w-full ${theme ? "h-4" : "h-3"} `}
                style={{ backgroundColor: barColor, border: theme && `2.5px solid ${borderColor}` }}
            />
        );
    }

    return (
        <div className="topicCard p-base bg-white1 shadow-standard w-full rounded-[20px] text-black1 flex flex-col gap-5 hover:scale-[102%] active:bg-white3 transition-all duration-200">
            <div className="flex flex-row justify-between items-start text-xs	w-full gap-5">
                <div className="flex flex-row gap-2.5 flex-wrap grow">
                    {item.languages.map((item) => (
                        <div className="languageCard rounded border border-white3 py-2 px-2.5" key={item.id}>
                            {item.name}
                        </div>
                    ))}
                </div>
                <div className="flex flex-row gap-2.5 h-full items-start">
                    <div className="flex items-start h-full justify-center p-2.5 gap-2.5 rounded bg-bgGreen3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none">
                            <path
                                fill="#04BD00"
                                d="M14.935 5.626a1.341 1.341 0 0 0-.424-.633 1.268 1.268 0 0 0-.691-.286l-3.685-.33L8.694.816a1.33 1.33 0 0 0-.477-.594 1.26 1.26 0 0 0-1.427 0 1.33 1.33 0 0 0-.476.593L4.87 4.376l-3.684.33c-.254.022-.496.121-.695.285-.2.164-.349.385-.427.636-.08.251-.085.52-.017.775.069.254.208.482.4.654L3.249 9.59l-.84 3.767c-.058.257-.041.525.048.772.088.247.245.461.45.616a1.258 1.258 0 0 0 1.428.063l3.168-1.993 3.167 1.993a1.257 1.257 0 0 0 1.427-.064c.206-.154.363-.369.451-.615.09-.247.106-.515.048-.772l-.84-3.767 2.8-2.533c.192-.173.331-.401.399-.655a1.387 1.387 0 0 0-.019-.775ZM10.621 8.48c-.178.16-.31.367-.382.599-.072.231-.082.48-.029.716l.736 3.304-2.775-1.747a1.253 1.253 0 0 0-1.338 0L4.057 13.1l.737-3.304a1.387 1.387 0 0 0-.03-.716 1.344 1.344 0 0 0-.38-.599L1.92 6.255l3.241-.29c.235-.022.46-.109.65-.253.19-.144.338-.34.429-.564L7.5 2.033l1.262 3.115c.09.225.239.42.43.564.19.144.414.231.649.252l3.24.29-2.461 2.227Z"
                            />
                        </svg>
                        <p className="text-bgGreen1 font-semibold">Popular</p>
                    </div>
                    <div className="p-2.5 rounded bg-bgRed3 gap-2.5 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none">
                            <path
                                fill="#DE1D1D"
                                d="M14.014 5.693c-.228-.237-.462-.482-.54-.668-.068-.166-.073-.506-.077-.806-.01-.647-.022-1.451-.594-2.022-.572-.57-1.375-.582-2.022-.594-.3-.004-.64-.01-.806-.078-.186-.077-.43-.311-.668-.539C8.85.547 8.28 0 7.5 0c-.78 0-1.35.547-1.807.986-.237.228-.482.462-.668.54-.166.068-.506.073-.806.077-.647.013-1.451.022-2.02.595-.57.573-.583 1.374-.596 2.02-.004.3-.01.641-.078.807-.077.186-.311.43-.539.668C.547 6.15 0 6.724 0 7.5s.547 1.35.986 1.81c.228.238.462.483.54.668.068.166.073.507.077.806.01.647.022 1.451.594 2.022.572.571 1.375.582 2.022.594.3.004.64.01.806.078.186.077.43.312.668.54.458.435 1.031.982 1.807.982s1.35-.547 1.807-.986c.237-.228.482-.462.668-.54.165-.068.506-.073.806-.077.647-.01 1.451-.022 2.022-.594.57-.572.582-1.375.594-2.022.004-.3.01-.64.078-.806.077-.186.311-.43.539-.668C14.453 8.85 15 8.28 15 7.5c0-.78-.547-1.35-.986-1.807Zm-1.12 2.54c-.312.323-.665.693-.853 1.148-.182.44-.19.916-.194 1.377-.005.347-.012.822-.139.948-.126.126-.6.134-.947.139-.461.007-.937.014-1.377.194-.453.188-.823.541-1.148.853-.233.223-.58.556-.736.556-.155 0-.503-.333-.733-.554-.323-.312-.693-.665-1.148-.853-.44-.182-.916-.19-1.377-.194-.347-.005-.822-.012-.948-.139-.126-.126-.134-.6-.139-.947-.007-.461-.014-.937-.194-1.377-.188-.453-.541-.823-.853-1.148-.223-.233-.556-.58-.556-.736 0-.155.333-.503.554-.733.311-.323.664-.693.853-1.148.182-.44.19-.916.194-1.377.007-.347.015-.822.144-.945.13-.122.602-.133.948-.139.461-.007.937-.014 1.377-.194.452-.188.823-.54 1.148-.852.227-.227.575-.56.73-.56.155 0 .503.333.733.554.323.311.693.664 1.148.853.44.182.916.19 1.377.194.347.005.822.012.948.139.126.126.134.6.139.947.007.461.014.937.194 1.377.188.453.541.823.853 1.148.22.23.554.578.554.733 0 .156-.331.506-.552.736ZM10.635 5.4a.774.774 0 0 1 0 1.1l-3.62 3.62a.777.777 0 0 1-1.1 0L4.364 8.567a.777.777 0 0 1 1.099-1.099L6.466 8.47l3.071-3.073a.776.776 0 0 1 1.098.002Z"
                            />
                        </svg>
                        <div className=" text-bgRed1 font-semibold whitespace-nowrap">{`${item.numBug} Bug Reported`}</div>
                    </div>
                </div>
            </div>
            <h1 className="text-3xl font-semibold">{item.title}</h1>
            {theme ? (
                <div className="flex gap-3 text-xl mt-3 items-end">
                    <p>Level</p>
                    <div style={{ backgroundColor: lightLevelColors[item.level] }} className="rounded-full p-3">
                        <div
                            style={{ backgroundColor: levelColors[item.level], textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)" }}
                            className=" rounded-full text-2xl text-white1 aspect-square h-12 w-12 flex items-center justify-center font-bold"
                        >
                            <p className="-translate-x-[1px] translate-y-[1px]">{item.level}</p>
                        </div>
                    </div>
                </div>
            ) : (
                //TODO: when level feature implemented, erase condition
                <p className="text-xl mt-7">{true ? ` ` : `Level ${item.level}`}</p>
            )}
            <div className="h-3 grid grid-cols-10 justify-evenly gap-2.5">{levelBars}</div>
        </div>
    );
}
