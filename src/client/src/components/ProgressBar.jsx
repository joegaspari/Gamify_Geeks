import React, { useEffect, useState } from "react";

export default function ProgressBar({ progress, difficulty, numChunks = 4, chunkSize = 5 }) {
    const [color, setColor] = useState({
        filled: "var(--color-black-2)",
        unfilled: "var(--color-white-3)",
    });
    const [calculatedProgress, setCalculatedProgress] = useState({
        quotient: 0,
        remainderPercentage: 0,
    });

    useEffect(() => {
        if (difficulty === 1) {
            setColor({
                filled: "var(--color-bg-green-1)",
                unfilled: "var(--color-bg-green-2)",
            });
        } else if (difficulty === 2) {
            setColor({
                filled: "var(--color-bg-blue-1)",
                unfilled: "var(--color-bg-blue-2)",
            });
        } else if (difficulty === 3) {
            setColor({
                filled: "var(--color-bg-red-1)",
                unfilled: "var(--color-bg-red-3)",
            });
        } else {
            setColor({
                filled: "var(--color-black-2)",
                unfilled: "var(--color-white-3)",
            });
        }

        const quotient = Math.floor(progress / chunkSize);
        const remainderPercentage = Math.round(((progress % chunkSize) / chunkSize) * 100);
        setCalculatedProgress({ quotient, remainderPercentage });
    }, [difficulty, progress]);

    useEffect(() => {
        const tempBarDivs = [];
        for (let i = 0; i < numChunks; i++) {
            const style = {
                border: `1px solid ${color.filled}`,
                ...(i < calculatedProgress.quotient
                    ? { backgroundColor: color.filled }
                    : i == calculatedProgress.quotient && calculatedProgress.remainderPercentage >= 50
                    ? {
                          background: `linear-gradient(to right, ${color.filled} ${calculatedProgress.remainderPercentage}%, ${color.unfilled} ${
                              100 - calculatedProgress.remainderPercentage
                          }%)`,
                      }
                    : i == calculatedProgress.quotient && calculatedProgress.remainderPercentage < 50
                    ? {
                          background: `linear-gradient(to left, ${color.unfilled} ${100 - calculatedProgress.remainderPercentage}%, ${color.filled} ${
                              calculatedProgress.remainderPercentage
                          }%)`,
                      }
                    : { backgroundColor: color.unfilled }),
            };

            tempBarDivs.push(<div key={i} className="w-full rounded-full h-3" style={style} />);
        }
        setBarDivs(tempBarDivs);
    }, [color, calculatedProgress]);

    const [barDivs, setBarDivs] = useState([]);

    return <div className="flex flex-row h-fit justify-between gap-1 h-2">{barDivs}</div>;
}
