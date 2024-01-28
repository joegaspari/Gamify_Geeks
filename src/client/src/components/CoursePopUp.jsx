import React, { useState, useRef, useEffect } from "react";
import BlackPlus20Icon from "./icon/Plus/BlackPlus20Icon";

import BlackCancel from "./icon/cancel/BlackCancel";
import Searchbar from "./InputBox/Searchbar";

const defaultImg = "https://via.placeholder.com/47";

export default function CoursePopUp({
    closePopup,
    courses,
    totalCourses,
    handleCourseClick,
    handleCodeSubmit,
    needCode = false,
    errorJoinMsg = "",
    isLoading = false,
    successJoinMsg = "",
    handleSearchChange,
}) {
    const popupRef = useRef(null);

    const [code, setCode] = useState("");

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            const parent = event.target.closest("#coursesPopupBtn");
            if (event.target.id == "coursesPopupBtn") {
                return;
            }
            if (parent && parent.id == "coursesPopupBtn") {
                return;
            }
            if (!popupRef.current || popupRef.current.contains(event.target)) {
                return;
            }
            closePopup();
            //need to initiate classes for pop up according to search is reset to ''
            handleSearchChange("");
        };

        window.addEventListener("mousedown", closeOnOutsideClick);

        scrollToTop("coursesBox");

        return () => {
            window.removeEventListener("mousedown", closeOnOutsideClick);
            // document.body.style.overflow = 'unset';
        };
    }, []);

    const onCodeChange = (code) => {
        setCode(code);
    };

    const onSubmit = () => {
        if (isLoading) return;

        handleCodeSubmit(code);
        setCode("");
        // scrollToBottom("coursesBox");
    };

    const onCourseClick = (id) => {
        handleCourseClick(id);
        closePopup();
    };

    const scrollToTop = (id) => {
        const element = document.getElementById(id);
        element.scrollTop = 0;
    };

    // const scrollToBottom = (id) => {
    //   const element = document.getElementById(id);
    //   element.scrollTop = element.scrollHeight;
    // };

    const onImgError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultImg;
    };

    const [search, setSearch] = useState("");

    const onSearchChange = (value) => {
        setSearch(value);
        handleSearchChange(value);
    };

    return (
        <div
            id="coursesPopup-container"
            ref={popupRef}
            className={`
        z-[200]
        text-black1
        bg-white1
        p-[30px]
        rounded-2xl
        w-[290px]
        flex
        flex-col
        border-2 border-black2 
        shadow-lg
        `}
        >
            <div className="flex justify-between mb-3 ">
                <h1 className="text-2xl	font-bold my-auto	">My Classes</h1>
                <button
                    onClick={closePopup}
                    className={`
                hover:scale-110
                transition
                duration-150
                rounded-lg
                hover:bg-bgBlue2
                h-7 w-7 flex justify-center items-center
                `}
                >
                    <BlackCancel />
                </button>
            </div>
            <section className="pb-2">
                {totalCourses > 3 && <Searchbar placeholder={"Search a Class"} onSearchChange={onSearchChange} search={search} size="small" />}
            </section>
            <div id="coursesBox" className="flex flex-col gap-1  overflow-y-scroll scroll-hidden max-h-[250px]">
                {courses &&
                    courses.map((i) => (
                        <div
                            key={i.classId}
                            id={i.classId.toString()}
                            onClick={(e) => onCourseClick(e.currentTarget.id)}
                            className="classCard flex flex-row gap-3 w-full p-2 items-center rounded-lg hover:bg-bgBlue2 transition duration-150 cursor-pointer"
                        >
                            <div className="w-10 h-10 aspect-square bg-white3 border border-white3 rounded-lg">
                                <img
                                    className="bg-offWhite2 w-full h-full rounded-full "
                                    src={i.img || defaultImg}
                                    alt=""
                                    onError={(e) => {
                                        onImgError(e);
                                    }}
                                />
                            </div>
                            <div className="flex justify-between items-center w-3/4">
                                <div className="leading-4 w-full">
                                    <h2 className="font-semibold text-xl ">{i.name}</h2>
                                    <p className="text-sm truncate " title={i.description}>
                                        {i.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            {/* <button className="flex rounded-lg bg-white1 h-12 p-5 justify-between items-center border border-black2">
                <p className="text-black1 text-lg">Add Class Code</p>
                <BlackPlus20Icon />
            </button> */}
            {needCode && (
                <>
                    <hr className="border border-white3 mb-5 mt-2" />
                    <div className="relative flex flex-col justify-between items-center ">
                        <label htmlFor="search_class_code" className="absolute  text-black2 bg-beige1 rounded-3xl px-1 leading-3 -top-1.5 left-4 text-xs">
                            Class Code
                        </label>
                        <input
                            type="text"
                            id="search_class_code"
                            name="search_class_code"
                            value={code}
                            className="
                      text-black1 text-lg rounded-lg
                      bg-white1 h-12 w-full border
                      border-black2 ps-2 pe-11"
                            placeholder="Add Class Code"
                            onChange={(e) => onCodeChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                            disabled={isLoading}
                        />
                        <div
                            id="addClassBtn"
                            onClick={() => onSubmit()}
                            className="absolute  p-1 top-2 right-2  h-8 w-8 flex items-center rounded-full justify-center aspect-square cursor-pointer hover:bg-bgBlue2 duration-150 ease-in"
                        >
                            <BlackPlus20Icon />
                        </div>
                    </div>
                    {errorJoinMsg !== "" && <p className="mt-2 text-red-500 text-sm">{errorJoinMsg}</p>}
                    {successJoinMsg !== "" && <p className="mt-2 text-green-500 text-sm">{successJoinMsg}</p>}
                    {isLoading && <p className="mt-2 text-bgBlue1 text-sm">Loading...</p>}
                </>
            )}
        </div>
    );
}
