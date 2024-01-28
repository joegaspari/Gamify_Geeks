import React from 'react';
import TrashCan from './icon/TrashCan';
import Save from './icon/Save';

const CreateClassCard = ({newClassInfo, setNewClassInfo, createClass, cancleCreateClass}) => {

    const handleChangeName = (e) => {
        setNewClassInfo({...newClassInfo, name: e.target.value});
    }

    const handleChangeDescription = (e) => {
        setNewClassInfo({...newClassInfo, description: e.target.value});
    }

    const handleCreateClass = () => {
        createClass();
    }

    const handleCancleCreateClass = () => {
        cancleCreateClass();
    }


    return (
        <div className="p-[30px] bg-white1 rounded-[20px] shadow-md flex flex-col gap-[30px]">
            <div className="flex justify-between items-start h-full">
                <div className={`
                flex flex-col items-start
                gap-[20px]
                `}>
                    <div className="flex flex-col gap-[10px]">
                        <label htmlFor="create-class-name">
                            {"Class Name"}
                        </label>
                        <input 
                        name="create-class-name"
                        className={`
                        text-xl 
                        ${newClassInfo.name !="" && "font-semibold" }
                        rounded-md
                        border border-white3 p-[10px]
                        `} 
                        onChange={handleChangeName}
                        value={newClassInfo.name}
                        placeholder="Add class name"
                        />
                    </div>
                    <div className="flex flex-col gap-[10px] w-full">
                        <label htmlFor="create-class-desscription">
                            {"Class Description"}
                        </label>
                        <input 
                        name="create-class-description"
                        className={`
                        text-sm text-black2
                        rounded-md
                        border border-white3 p-[10px]
                        w-full
                        `} 
                        onChange={handleChangeDescription}
                        value={newClassInfo.description}
                        placeholder={"Add class description"}
                        />
                    </div>
                </div>
                <div className="flex gap-[20px] justify-between items-center">
                    <div 
                    className="rounded-3xl hover:scale-105 hover:bg-bgBlue2 transition-all ease-in duration-150 cursor-pointer"
                    onClick={handleCreateClass}
                    >
                        <Save/>
                    </div>
                    <div 
                    className="rounded-3xl hover:scale-105 hover:bg-bgBlue2 transition-all ease-in duration-150 cursor-pointer"
                    onClick={handleCancleCreateClass}
                    >
                        <TrashCan/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateClassCard;