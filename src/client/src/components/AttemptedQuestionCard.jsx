import React from 'react';

export default function AttemptedQuestionCard({ item }) {

  const colors = ["bgGreen", "bgBlue", "bgRed"]
  const validDifficulty = 1 <= item.difficultyId <= 3
  const chosenColor = validDifficulty ? colors[item.difficultyId-1] : ""

  return (
    <div className={`${validDifficulty ? `bg-${chosenColor}3 border-${chosenColor}1` : 'bg-white1 border-white3'} border rounded-[20px] p-base`}>
        <div className='w-full flex justify-between text-xs'>
        <div className={`${validDifficulty ? `bg-${chosenColor}3 border-${chosenColor}1 text-${chosenColor}1` : 'bg-white1 border-white3 text-black1'} border difficultyCard rounded py-2 px-2.5`}>
                {item.language}
            </div>
            <div className={`${validDifficulty ? `bg-${chosenColor}3 border-${chosenColor}1 text-${chosenColor}1` : 'bg-white1 border-white3 text-black1'} border difficultyCard rounded py-2 px-2.5`}>
                {item.difficulty}
            </div>
        </div>
        <h2 className='mt-[10px] text-xl font-semibold text-black1 leading-[20px]'>{item.topic}</h2>
        <p className='mt-[30px] text-xs text-black2 leading-[12px]'>{item.startDate}</p>
    </div>
  );
}

// Enables Tailwind Dynamic Styling DO NOT REMOVE

const possible = [
  "bg-bgGreen1", "bg-bgBlue1", "bg-bgRed1",
  "text-bgGreen3", "text-bgBlue3", "text-bgRed3",
  "border-bgGreen3", "border-bgBlue3", "border-bgRed3"
]