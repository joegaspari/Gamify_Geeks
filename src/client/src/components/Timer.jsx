import React, { useState, useEffect } from "react";

export default function Timer() {
    const [remainingTime, setRemainingTime] = useState("00:00:00");

    const calculateRemainingTime = () => {
        // Get the current date and time
        const currentDate = new Date();

        // Calculate the time until the end of the day
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999); // Set the time to 23:59:59.999

        const timeRemaining = endOfDay - currentDate; // Difference in milliseconds

        // Convert milliseconds to hours, minutes, and seconds
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setRemainingTime(`${hoursRemaining}:${minutesRemaining}:${secondsRemaining}`);
    };

    useEffect(() => {
        // Call calculateRemainingTime immediately
        calculateRemainingTime();

        // Update the time every second
        const intervalId = setInterval(calculateRemainingTime, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return <span>{remainingTime}</span>;
}
