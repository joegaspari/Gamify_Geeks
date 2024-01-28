import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./CustomCalendar.css";
import CalendarSticker from "./CalendarSticker";
import LeftArrow from "../icon/arrow/LeftArrow";
import RightArrow from "../icon/arrow/RightArrow";
import { useHelpMode } from "../../context/HelpModeContext";

const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export default function Calender({ monthStreaks, handleChangeDate }) {
    const { isHelpModeActive } = useHelpMode();
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const [streakDays, setStreakDays] = useState([]);



    useEffect(() => {
        handleChangeDate({ year: year, month: months[month] });
    }, []);


    useEffect(() => {
        if (!monthStreaks) return;

        const filteredData = monthStreaks
            .filter(item => item.tag)
            .map(item => ({
                date: new Date(item.date),
            }));

        console.log(filteredData);
        setStreakDays(filteredData);
    }, [monthStreaks]);

    const onMonthsChange = (date) => {
        const revisedDate = date.activeStartDate;
        console.log(months[revisedDate.getMonth()]);
        console.log(revisedDate.getFullYear());

        setMonth(revisedDate.getMonth());
        setYear(revisedDate.getFullYear());
        handleChangeDate({ year: revisedDate.getFullYear(), month: months[revisedDate.getMonth()] });
    };

    return (
        <div className={`${isHelpModeActive && "hasHelp"} bg-white1 rounded-[20px] shadow-standard flex justify-center items-center p-base`}>
            <Calendar
                prevLabel={
                    <span className="flex justify-center items-center">
                        <LeftArrow />
                    </span>
                }
                nextLabel={
                    <span className="flex justify-center items-center">
                        <RightArrow />
                    </span>
                }
                locale="en-US"
                onActiveStartDateChange={onMonthsChange}
                tileContent={({ date, view }) => {
                    if (view === "month" && date.getMonth() === month) {

                        const sticker = streakDays.find((s) => {

                            return s.date.getDate() === date.getDate();
                        });
                        return sticker && <CalendarSticker date={date.getDate()} />;
                    }
                    return null;
                }}
            />
        </div>
    );
}

