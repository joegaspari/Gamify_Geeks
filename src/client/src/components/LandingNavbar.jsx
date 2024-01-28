import React from "react";
import { Link } from "react-router-dom";
import { useNeedAccount } from "../context/NeedAccountContext";

export default function LandingNavbar() {
    const { setNeedAccount } = useNeedAccount();

    const landingMenu = [
        {
            id: 1,
            elemId: "home",
            title: "Home",
            link: "/",
        },
        // {
        //     id: 2,
        //     elemId: "help",
        //     title: "Help",
        //     link: "/help",
        // },
        {
            id: 2,
            elemId: "signIn",
            title: "Sign in",
            link: "/accounts/login",
        },
        {
            id: 3,
            elemId: "signUp",
            title: "Sign Up",
            link: "/accounts/signup",
        },
    ];

    return (
        <div className="h-20 bg-blue1 text-white1 flex justify-between items-center">
            <div className="flex items-center justify-center h-[desiredHeight] w-[desiredWidth]">
                <Link to="/">
                    <img
                        src="/image/logo/smallLogo.svg"
                        className="h-12 w-32 object-contain m-0 p-0"
                        alt="Logo"
                    />
                </Link>
            </div>
            <div
                className={`
            h-full flex 
            justify-between items-center 
            text-white1 font-semibold
            xl:px-10 lg:px-7 px-4  
            xl:text-xl sm:text-lg text-sm 
            `}
            >
                {landingMenu &&
                    landingMenu.map((i) => (
                        <Link
                            id={i.elemId}
                            key={i.id}
                            to={i.link}
                            className={`
                    h-full 
                    xl:w-36 lg:w-28 md:w-24 w-20 
                    xl:px-7 lg:px-4 sm:px-3 px-2 
                    
                    flex items-center justify-center
                    hover:bg-bgBlue1
                    transition-all
                    duration-150
                    active:bg-blue1
                    `}
                        >
                            {i.title}
                        </Link>
                    ))}
            </div>
        </div>
    );
}
