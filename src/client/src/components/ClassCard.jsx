import React, { useState } from "react";
import TrashCan from "./icon/TrashCan";
import People from "./icon/People";
import LargePencil from "./icon/pencil/LargePencil";
import CopyIcon from "./icon/CopyIcon";
import CopyToClipboardButton from "./CopyToClipBoardButton/CopyToClipBoardButton";
import Save from "./icon/Save";
import { useProfile } from "../context/ProfileContext";

const ClassCard = ({ item, handleDeleteClass, handleSaveEditClass }) => {
    const { updateClassesForPopup } = useProfile();

    const [classId, setClassId] = useState(item.classId);
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [isEditClicked, setisEditClicked] = useState(false);

    const [initialName, setInitialName] = useState(item.name);
    const [initialDescription, setInitialDescription] = useState(item.description);

    const handleEditClass = () => {
        if (!isEditClicked) {
            setisEditClicked(true);
        }
    };

    const onSaveEditClass = () => {
        if (name == initialName && description == initialDescription) {
            const userResponse = window.confirm("No changes were made. Would you still like to save?");
            if (userResponse) {
                setisEditClicked(false);
                return;
            }
        }

        if (name == "" || description == "") {
            alert("Please fill in all the fields.");
            return;
        }

        handleSaveEditClass({ classId, name, description }).then(() => {
            // Alert the user that the item was successfully edited
            updateClassesForPopup("");
            alert(`${name} was successfully edited.`);
            setName(name);
            setInitialDescription(description);
            setName(name);
            setInitialDescription(description);
        });

        setisEditClicked(false);
    };

    const onDeleteClass = () => {
        const userInput = prompt(`Please enter the class name you want to delete. \nClass name: ${name}`);

        // Check if the user canceled the prompt
        if (userInput === null) {
            // The user canceled the prompt
            return;
        }

        // Check if the user input matches the item name
        if (userInput === name) {
            // Implement the delete logic here
            handleDeleteClass(classId).then(() => {
                // Alert the user that the item was successfully deleted
                updateClassesForPopup("");
                alert(`${name} was successfully deleted.`);
            });
        } else {
            // The entered name does not match the item's name
            alert(`The entered class name does not match. ${name} was not deleted.`);
        }
    };

    const handleChangeName = (e) => {
        setName(e.target.value);
    };

    const handleChangeDescription = (e) => {
        setDescription(e.target.value);
    };

    return (
        <div id={`class-${classId}`} className="p-[30px] bg-white1 rounded-[20px] shadow-md flex flex-col gap-[30px]">
            <div className="flex justify-between items-start h-full">
                <div
                    className={`
                flex flex-col items-start
                gap-10  w-3/4
                `}
                >
                    <input
                        className={`
                    text-xl
                    rounded-md
                    bg-transparent truncate
                    ${item.name != "" && "font-semibold"}
                    ${isEditClicked && "border border-white3 p-[10px]"}
                    `}
                        onChange={handleChangeName}
                        disabled={!isEditClicked}
                        value={name}
                        placeholder="Update class name"
                    />
                    <input
                        className={`
                    text-sm text-black2
                    rounded-md
                    w-full 
                    bg-transparent truncate
                    ${isEditClicked && "border border-white3 p-[10px]"}
                    `}
                        onChange={handleChangeDescription}
                        disabled={!isEditClicked}
                        value={description}
                        placeholder="Update class description"
                    />
                </div>
                <div className="flex gap-[20px] justify-between items-center">
                    <div className="rounded-3xl hover:scale-105 hover:bg-bgBlue2 transition-all ease-in duration-150 cursor-pointer">
                        {!isEditClicked ? (
                            <div onClick={handleEditClass}>
                                <LargePencil />
                            </div>
                        ) : (
                            <div
                                className="rounded-3xl hover:scale-105 hover:bg-bgBlue2 transition-all ease-in duration-150 cursor-pointer"
                                onClick={onSaveEditClass}
                            >
                                <Save />
                            </div>
                        )}
                    </div>
                    <div className="rounded-3xl hover:scale-105 hover:bg-bgBlue2 transition-all ease-in duration-150 cursor-pointer" onClick={onDeleteClass}>
                        <TrashCan />
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-end h-full">
                <div className="flex flex-col gap-[10px]">
                    <div className="flex flex-row gap-[10px]">
                        <People />
                        <p className="text-xs">{`${item.studentNumber || "0"} Students`}</p>
                    </div>
                    <div className="flex flex-row gap-[10px]">
                        <CopyToClipboardButton
                            text={item.joinCode}
                            msg={"Code Copied!"}
                            boxStyle={`
                        w-full
                        hover:scale-105  transition-all ease-in duration-150 cursor-pointer
                        flex flex-row gap-[10px]
                        `}
                        >
                            <CopyIcon />
                            <p className="text-xs">{`${item.joinCode}`}</p>
                        </CopyToClipboardButton>
                    </div>
                </div>
                <div className="flex items-end h-full">
                    <p className="text-xs">{`Created: ${item.created}`}</p>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
