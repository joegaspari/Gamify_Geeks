import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ items, title }) {
    const labels = items.map((item) => item.day.substring(0, 3));
    const solvedData = items.map((item) => item.solved);
    const attemptedData = items.map((item) => item.attempted);

    const [isHover, setIsHover] = useState(false);

    const options = {
        responsive: true,

        onHover: (event, chartElement) => {
            chartElement[0] ? setIsHover(true) : setIsHover(false);
        },

        layout: {
            height: 10,
        },

        plugins: {
            legend: {
                position: "top",
                align: "end",
                labels: {
                    font: {
                        size: 14,
                        family: "'Poppins', sans-serif",
                        weight: 400,
                        usePointStyle: true,
                    },
                    color: "#787878",
                    boxWidth: 20,
                    boxHeight: 10,
                },
                onHover: (event, legendItem, legend) => {
                    setIsHover(true);
                },
                onLeave: (event, legendItem, legend) => {
                    setIsHover(false);
                },
            },

            title: {
                display: false,
                text: title,
                font: {
                    family: "'Poppins', sans-serif",
                },
                color: "#000",
                padding: {
                    top: 20,
                    bottom: 20,
                },
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: "Attempted",
                data: attemptedData,
                backgroundColor: "#CDE7FE",
                barPercentage: 0.8,
                categoryPercentage: 0.5,
            },
            {
                label: "Solved",
                data: solvedData,
                backgroundColor: "#1A8CE0",
                barPercentage: 0.8,
                categoryPercentage: 0.5,
            },
        ],
    };

    return (
        <div className={`${isHover && "cursor-pointer"} -mt-5 flex flex-col justify-center items-start h-full w-full`}>
            <h2 className=" translate-y-5 ps-1 font-semibold text-base 2xl:text-xl leading-4	text-left w-fit">{title}</h2>
            <Bar options={options} data={data} />
        </div>
    );
}
