import React from 'react';
import HexagonImage from './HexagonImage/HexagonImage';
import ProgressBar from './ProgressBar';

export default function ProgressPopup({ closePopup, progressData }) {
    
    const colors = ["bgGreen1", "bgBlue1", "bgRed1"]
    
    return (
        <div id='progressPopupContainer' onClick={(e) => e.stopPropagation()} 
            className="w-[500px] bg-white p-[30px] rounded-[10px] shadow-standard flex flex-col gap-5 justify-center items-center">

            <p className="text-[28px] text-black1 font-extrabold">Well Done!</p>
            
            <div className='h-fit w-full flex flex-col gap-5'>
            {
                progressData && progressData.map((data, index) => (
                    <React.Fragment key={data.id}>
                        <div className='flex gap-5'>
                            <div>
                                <HexagonImage resize={4/5} profileImg={data.iconpath}/> 
                            </div>
                            <div className='h-[50px] w-full flex flex-col gap-2 justify-center'>
                                <h4 className='font-semibold text-[18px] leading-5'>{data.title}</h4>
                                <ProgressBar progress={data.progress} difficulty={data.difficulty} numChunks={5} chunkSize={data.objective/5}/>
                            </div>
                            <div className='h-full'>
                                <p className={`text-${colors[data.difficulty-1]} text-3xl font-semibold`}>+1</p>
                            </div>
                        </div>
                        <hr className="border border-white3" />
                    </React.Fragment>
                ))
            }
            </div>

            <button onClick={closePopup}
                className={`text-[20px] leading-5 text-white1 bg-bgGreen1 w-full py-5 
                rounded-lg font-semibold active:bg-green-800 hover:scale-105
                transition-all duration-150`}>
                Next Question
            </button>
            
            <button onClick={closePopup} 
                className={`text-sm text-black2 font-semibold hover:underline
                rounded-lg transition-all duration-150 hover:scale-105`}>
                Review Answer
            </button>
        </div>
    );
}
