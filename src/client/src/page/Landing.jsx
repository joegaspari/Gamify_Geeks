import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FireIcon from "../components/icon/fireIcon/FireIcon";
import KeyIcon from "../components/icon/KeyIcon";

const perksData = [
    {
        title: "Compete with your peers",
        content: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        imgSrc: "/image/landing/tile1.png",
        altText: "code"
    },
    {
        title: "Learn new languages",
        content: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        imgSrc: "/image/landing/tile2.png",
        altText: "code"
    },
    {
        title: "Join as an Instructor",
        content: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        imgSrc: "/image/landing/tile1.png",
        altText: "code"
    }
];

const stepsData = [
    {
        basis: 'basis-1/3',
        text: 'Generate a question'
    },
    {
        basis: 'basis-2/3',
        text: 'Submit your answer'
    },
    {
        basis: 'basis-1/3',
        text: 'Level Up!'
    }
];

const sections = [
    {
        left: (
            <div>
                <h1 className="text-3xl font-bold text-black1">Get Personalized feedback</h1>
                <p className="pl-5 mt-4">
                    Understand how you can improve your answer through our AI-feedback feature. <br />
                    Every feedback is tailored to your needs to help you ace coding in various languages.
                </p>
            </div>
        ),
        right: (
            <div className="block rounded-lg bg-white1 p-6 shadow-2xl px-4 ml-20">
                <h2 className="text-lg font-bold text-center">Not Quit! Here's some feedback</h2>
                <div className="mt-4 mb-4 border-solid border-gray-300 border rounded p-4 text-left">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                    <br />
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                </div>
                <button className="w-full h-12 px-6 text-white font-semibold transition-colors duration-150 bg-blue-500 rounded-lg focus:shadow-outline hover:bg-blue-400">
                    Try Again
                </button>
            </div>
        )
    },
    {
        left: (
            <div className="block rounded-lg bg-white1 p-6 shadow px-4 mr-20">
                <h2 className="text-lg font-bold text-center">Calendar goes here</h2>
                <div className="mt-4 mb-4 border-solid border-gray-300 border rounded p-4 text-left">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                    <br />
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                </div>
                <button className="w-full h-12 px-6 text-white font-semibold transition-colors duration-150 bg-red-500 rounded-lg focus:shadow-outline hover:bg-red-400">
                    Try Again
                </button>
            </div>
        ),
        right: (
            <div>
                <h1 className="flex gap-5 justify-center font-bold text-4xl text-black1 text-center">
                    Keep a streak <FireIcon className="inline" />
                </h1>
                <p className="text-left mt-4">Keep a streak by coding every day on the platform.</p>
            </div>
        )
    },
    {
        left: (
            <div>
                <h1 className="font-bold text-4xl text-black1 pl-4">Live Leaderboard</h1>
                <p className="mt-4">
                    Join now and compete with users all over the world! <br />
                    See where you stand compared to other learners on the live leaderboard.
                </p>
            </div>
        ),
        right: (
            <div className="block rounded-lg bg-white1 p-6 shadow px-4 ml-20">
                <h2 className="text-lg font-bold text-center">Leaderboard goes here</h2>
                <div className="mt-4 mb-4 border-solid border-gray-300 border rounded p-4 text-left">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                    <br />
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                </div>
                <button className="w-full h-12 px-6 text-white font-semibold transition-colors duration-150 bg-green-500 rounded-lg focus:shadow-outline hover:bg-green-400">
                    Try Again
                </button>
            </div>
        )
    },
    {
        left: (
            <div className="">
                <div className="mr-20">
                    <img src="/image/landing/solve.png" alt="solve" className="mr-40" />
                </div>
            </div>
        ),
        right: (
            <div className="ml-20">
                <h1 className="font-bold text-4xl	text-black1 text-center">Badges</h1>
                <p className="mt-4 text-left">Earn badges upon completing courses and challenges, showcasing your accomplishments and skills.</p>
            </div>
        )
    }
];




export default function Home() {
    const sectionsRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useEffect(() => {
        sectionsRef.current = document.querySelectorAll('.fade-in');
        leftRef.current = document.querySelectorAll('.left');
        rightRef.current = document.querySelectorAll('.right');

        const handleIntersection = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('left')) {
                        entry.target.classList.add("slide-in-left");
                    } else if (entry.target.classList.contains('right')) {
                        entry.target.classList.add("slide-in-right");
                    } else {
                        entry.target.classList.add("visible");
                    }
                }
            });
        };



        const options = {
            threshold: 0.4
        };

        const observer = new IntersectionObserver(handleIntersection, options);

        sectionsRef.current.forEach((section) => {
            observer.observe(section);
        });

        leftRef.current.forEach((section) => {
            observer.observe(section);
        });

        rightRef.current.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            if (sectionsRef.current) {
                sectionsRef.current.forEach((section) => {
                    observer.unobserve(section);
                });
            }

            if (leftRef.current) {
                leftRef.current.forEach((section) => {
                    observer.unobserve(section);
                });
            }

            if (rightRef.current) {
                rightRef.current.forEach((section) => {
                    observer.unobserve(section);
                });
            }

        };
    }, []);




    return (
        <>
            <div id="landingBox" className="container mx-auto px-10 py-8" style={{ height: "calc(100vh-100px)" }}>
                <div className="flex justify-center pt-20 pb-12">
                    <img src="/image/landing/banner.svg" alt="Banner" className="w-full h-auto" />
                </div>
                <div className="flex flex-col mt-2 mb-16">
                    <div className="flex justify-center">
                        <Link
                            id="needAccountBtn"
                            className={`
                                w-fit
                                text-2xl
                                font-semibold
                                text-center
                                align-middle
                                text-white1

                                rounded-lg
                                p-2 
                                px-20
                                bg-blue-950
                                hover:bg-blue-800
                                transition-all
                                duration-150
                                ease-in
                                cursor-pointer
                                shadow-
                            `}
                            to="/accounts/signup"
                        >
                            Get Started
                        </Link>

                    </div>
                </div>
            </div>
            <div className="mx-40  px-4 pb-16 fade-in">
                <div className="flex flex-col text-center">
                    <h1 className="font-extrabold text-6xl text-black1 firstcharlarge" style={{ color: "#002145" }}>
                        <span className="text-8xl align-middle">G</span>amify-geek perks
                    </h1>
                    <p>Learn what we have to offer</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-12 py-16">
                    {perksData.map((perk, index) => (
                        <div key={index} className="w-[300px] min-h-[300px] rounded-lg bg-gray-200 p-6 shadow dark:bg-neutral-700  px-4 text-center flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-7 text-gray-700">
                                    {perk.title}
                                </h2>
                                <div className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                                    {perk.content}
                                </div>
                            </div>
                            <div className="self-end">
                                <img src={perk.imgSrc} alt={perk.altText} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mx-40 px-4 py-8 fade-in">
                <div className="flex flex-col text-center">
                    <h1 className="font-medium text-4xl text-black1">Earn while coding</h1>
                </div>
                <div className="flex flex-row text-center align-center mt-10 ml-40 mr-40 justify-center" style={{ alignItems: 'center' }}>
                    {stepsData.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className={step.basis}>
                                <div className="lightgreen">
                                    <div className="lightblue">
                                        <div className="lightpink">
                                            <div className="radiusicon">
                                                <KeyIcon />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">{step.text}</div>
                            </div>
                            {index < stepsData.length - 1 && <div className="line"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {sections.map((section, idx) => (
                <div key={idx} className={`mx-40 px-4 py-4 ${idx % 2 === 0 ? "left" : "right"}`}>
                    <div className="grid grid-cols-2 gap-12 py-16 items-center">
                        <div className={`left-element`}>
                            {section.left}
                        </div>
                        <div className={`right-element"}`}>
                            {section.right}
                        </div>
                    </div>
                </div>
            ))}



            <div class="mx-40  px-4 py-16">
                <div className="text-center">
                    <h2 className="text-sm font-bold text-center">&copy; Learnification Technologies</h2>
                    <p className="text-xs">Powered by GamifyGeeks</p>
                </div>
            </div>
        </>
    );
}


