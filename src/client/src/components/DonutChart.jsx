import React from "react";
import { Chart as ChartJS, ArcElement } from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

const data = {
    labels: ["Current Exp", "Remaining Exp"],
    datasets: [
        {
            label: "Value",
            data: [65, 35],
            backgroundColor: ["#1A8CE0", "#E9F5FE"],
            hoverBackgroundColor: ["#36A2EB", "#FFCE56"],
        },
    ],
};

const options = {
    cutout: "80%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: false,
        },
        legend: {
            display: false,
        },
    },
    elements: {
        arc: {
            borderWidth: 1,
            borderColor: "#C8C8C8",
        },
    },
};

const standardNum = 2000;

export default function DonutChart({ item, title }) {
    const newData = {
        ...data,
        datasets: [
            {
                ...data.datasets[0],
                data: [item.rate, standardNum - item.rate],
            },
        ],
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center ">
            <div className="w-full h-full">
                <Doughnut data={newData} options={options} />
            </div>
            <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                <p className="font-bold text-black1 lg:text-3xl text-2xl">{((item.rate / standardNum) * 100).toFixed(1)}%</p>
                <p className="text-black2 text-sm  ">{title}</p>
            </div>
        </div>
    );
}
