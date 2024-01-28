import React, { useState } from 'react';
import Copy from "../icon/Copy.jsx"

export default function CopyClassCode({classCode}) {

    const [ isCopied, setIsCopied ] = useState(false)
    const [ timer, setTimer ] = useState(null)

    // Function to set a new timeout
    const setNewTimeout = () => {
        // Clear the previous timeout, if it exists
        if (timer) {
            clearTimeout(timer);
        }
        
        // Set a new timeout and update the timer state
        const newTimer = setTimeout(() => {
            setIsCopied(false);
        }, 1500);

        setTimer(newTimer);
    };
    
    // Call setNewTimeout whenever you want to refresh the timeout duration
    // For example, when you want to refresh the timeout after copying:
    const handleCopy = async() => {
        await navigator.clipboard.writeText(classCode);
        setIsCopied(true);
        setNewTimeout();
    };

    return (
        <div 
            onClick={handleCopy}
            className={`copyContainer cursor-pointer h-fit w-full border rounded-xl border-white3 p-5 flex justify-between`}>
            <p id='classCode' className='text-2xl leading-6'>{classCode}</p>
            <div className='flex flex-row gap-2'>
                {
                    isCopied &&
                    <p className='text-bgGreen1'>
                        Copied!
                    </p>
                }
                <div id='copyBtn' className='flex items-center'>
                    <Copy/>
                </div>
            </div>
        </div>
    );
}
