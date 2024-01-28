import React from 'react';
import XIcon from './icon/process/XIcon';
import CheckIcon from './icon/process/CheckIcon';
import ProcessingIcon from './icon/process/ProcessingIcon';

export default function QuestionDetailsCard({questionData, changeQuestion, index}) {

    const icons = [<XIcon />, <ProcessingIcon />, <CheckIcon />]

    return (
        <div 
            onClick={() => changeQuestion(questionData)}
            className='bg-white1 p-base flex flex-col gap-[20px] rounded-[20px] shadow-standard cursor-pointer hover:scale-105 transition duration-150'>
            <div className='flex flex-row justify-between'>
                <h2 className='text-2xl text-black1 w-fit font-semibold'>
                    {`Question ${index}`}
                </h2>
                <div>
                    {icons[questionData.status-1]}
                </div>
            </div>
            <p className='text-sm text-black1 line-clamp-3'>
                {questionData.textContent}
            </p>
        </div>
    );
}
