import React, { useState } from 'react';
import styles from './CopyToClipBaordButton.module.css';

const CopyToClipboardButton = ({ text, children, boxStyle, msg }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async (text) => {
        try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
        } catch (err) {
        console.error('Failed to copy text: ', err);
        }
    }

    return (
        <div className="relative w-full flex flex-col items-center">
            <button 
                className={`${boxStyle}`}
                onClick={() => copyToClipboard(text)}
            >
                {children}
            </button>
            {isCopied && <p className="absolute top-[100%] mt-1 text-xs text-bgGreen1">{msg}</p>}
        </div>
    );
}

export default CopyToClipboardButton;
