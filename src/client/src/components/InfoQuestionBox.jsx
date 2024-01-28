import React  from 'react';
import BoldPlus from './icon/Plus/BoldPlus';
import BoldMinus from './icon/minus/BoldMinus';
import { useToggle } from '../hook/useToggle';

const InfoQuestionBox = ({item}) => {

    const [isToggled, toggle] = useToggle(false);

    return (

        <div className="infoCard p-base border border-white3 rounded-[10px] h-fit">
            <div className="flex justify-between items-center h-full">
                <h1 className="font-semibold text-xl h-full">{item.title}</h1>
                <button className="flex justify-center items-center cursor-pointer hover:scale-110  transition-all duration-150 h-9 w-9 rounded-full p-1 " onClick={toggle}>
                    {isToggled ? <BoldMinus /> : <BoldPlus />}
                </button>
            </div>
            {isToggled && (
                <p className="text-base mt-base">
                    {item.content}
                </p>
            )}
        </div>
    )
}

export default InfoQuestionBox;