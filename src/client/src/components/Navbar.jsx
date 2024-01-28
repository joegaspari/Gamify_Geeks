import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import Menu from "./Menu";
import SubMenu from "./SubMenu";
import DashboardSelected from "./icon/dashboard/DashboardSelected";
import DashboardUnselected from "./icon/dashboard/DashboardUnselected";
import ExploreSelected from "./icon/explore/ExploreSelected";
import ExploreUnselected from "./icon/explore/ExploreUnselected";
import ModulesSelected from "./icon/Modules/ModulesSelected";
import ModulesUnselected from "./icon/Modules/ModulesUnselected";
import StudentsSelected from "./icon/students/StudentsSelected";
import StudentsUnselected from "./icon/students/StudentsUnselected";
import AnalyticsSelected from "./icon/analytics/AnalyticsSelected";
import AnalyticsUnselected from "./icon/analytics/AnalyticsUnselected";
import InfoSelected from "./icon/info/InfoSelected";
import InfoUnselected from "./icon/info/InfoUnselected";
import SettingsUnselected from "./icon/settings/SettingsUnselected";
import DownwardArrow from "./icon/arrow/DownwardArrow";
import LogOutIcon from "./icon/LogOutIcon";
import CoursePopUp from "./CoursePopUp";
import WhiteCancel from "./icon/cancel/WhiteCancel";
import { usePopup } from "../context/PopupContext";
import { useAuth } from "../context/AuthContext";
import Tooltip from "../components/Tooltip";
import { useProfile } from "../context/ProfileContext";
import { useLoading } from "../hook/useLoading";

const menuItems = [
    {
        id: "1",
        title: "Dashboard",
        path: "/dashboard",
        icon: {
            unSelected: <DashboardUnselected />,
            selected: <DashboardSelected />,
        },
        index: true,
    },
    {
        id: "2",
        title: "Explore",
        path: "/explore",
        icon: {
            unSelected: <ExploreUnselected />,
            selected: <ExploreSelected />,
        },
    },
];

const menuItemsForInstructor = [
    {
        id: "1",
        title: "Class Overview",
        path: "/classOverview",
        icon: {
            unSelected: <DashboardUnselected />,
            selected: <DashboardSelected />,
        },
        index: true,
    },
];

const defaultMenuItems = [
    {
        id: "1",
        title: "",
        path: "/",
        icon: {
            unSelected: "",
            selected: "",
        },
    },
];

const classItems = [
    {
        id: "1",
        title: "Modules",
        path: "/class/modules",
        icon: {
            unSelected: <ModulesUnselected />,
            selected: <ModulesSelected />,
        },
    },
    {
        id: "2",
        title: "Students",
        path: "/class/students",
        icon: {
            unSelected: <StudentsUnselected />,
            selected: <StudentsSelected />,
        },
    },
    {
        id: "3",
        title: "Analytics",
        path: "/class/analytics",
        icon: {
            unSelected: <AnalyticsUnselected />,
            selected: <AnalyticsSelected />,
        },
    },
];

const subMenus = [
    {
        id: "1",
        title: "Info Center",
        path: "/info",
        icon: {
            unSelected: <InfoUnselected />,
            selected: <InfoSelected />,
        },
    },
    // {
    //   id: '2',
    //   title: 'Setting',
    //   path: '/setting',
    //   icon: {
    //     unSelected: <SettingsUnselected />,
    //     selected: '',
    //   },
    // },
];

const defaultImg = "https://via.placeholder.com/47";

export default function Navbar({ handleClose, navbarRef, handleCoursePopupOpen }) {
    const { user } = useAuth();

    const revisedClassItems = useMemo(() => {
        if (user.userRoleId == 1 || user.userRoleId == 2) {
            return classItems.filter((item) => item.title !== "Students");
        }
        return classItems;
    }, [user.userRoleId, classItems]);

    const { openPopup } = usePopup();

    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    const { joinClass } = useData();

    const { profile, courses, mainCourse, updateMainCourse, updateClasses, searchClasses, coursesForPopup } = useProfile();

    const [isCoursesPopupOpen, setIsCoursesPopupOpen] = useState(false);

    useEffect(() => {
        handleCoursePopupOpen(isCoursesPopupOpen);
    }, [isCoursesPopupOpen]);

    //when user access page using input url, need to set mainCourse
    useEffect(() => {
        if (courses) {
            const pathParts = path.split("/");
            if (pathParts[1] === "class") {
                updateMainCourse(courses.find((course) => course.classId == pathParts[2]));
            }
        }
    }, []);

    const onImgError = (e) => {
        e.target.onerror = null;
        e.target.src = defaultImg;
    };

    const handleCourseClick = (id) => {
        const course = courses.find((course) => course.classId == id);
        course && updateMainCourse(course);
        const pathParts = path.split("/");
        if (pathParts[1] === "class") {
            pathParts.splice(2, 1, id);
        }
        const link = pathParts.join("/") + location.search; // Append the query parameters
        navigate(link);
    };

    const [errorJoinMsg, setErrorJoinMsg] = useState("");
    const [successJoinMsg, setSuccessJoinMsg] = useState("");
    const { isLoading, startLoading, stopLoading } = useLoading({});

    const handleCodeSubmit = (code) => {
        setErrorJoinMsg("");
        setSuccessJoinMsg("");

        if (code === "") {
            setErrorJoinMsg("Code is required!");
            setTimeout(() => {
                setErrorJoinMsg("");
            }, 3000);
            return;
        }

        !isLoading && startLoading();
        joinClass(code)
            .then((i) => {
                const newCourses = [...courses, i];
                updateClasses(newCourses);
                updateMainCourse(i);
                handleCourseClick(i.classId);
                setSuccessJoinMsg("Successfully Added the class!");
                setTimeout(() => {
                    setSuccessJoinMsg("");
                }, 3000);
            })
            .catch((err) => {
                console.log(err.message);
                setErrorJoinMsg(err.message);
                setTimeout(() => {
                    setErrorJoinMsg("");
                }, 3000);
            })
            .finally(() => {
                stopLoading();
            });
    };

    const handleSearchChange = (search) => {
        searchClasses(search);
    };

    return (
        <nav id="mainNavbar" ref={navbarRef} className="flex flex-col justify-between items-stretch h-full">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                            <Link to="/" className="mb-4 w-full">
                                <h1 className="px-base pb-0 pt-lg text-[40px] leading-10 font-bold">
                                    <img src="/image/logo/bannerLogo.svg" className="h-20 w-full object-contain" alt="Logo" />
                                </h1>
                            </Link>
                            <button
                                className={`
                xl:hidden flex justify-center items-center
                -translate-x-2 h-7 w-7
                hover:scale-110 hover:bg-bgBlue1
                transition-all duration-150
                rounded-full
                `}
                                onClick={handleClose}
                            >
                                <WhiteCancel />
                            </button>
                        </div>

                        <section className="p-base flex flex-row items-center justify-between">
                            <div className="flex flex-row gap-4 w-5/6">
                                {mainCourse && (
                                    <>
                                        <div className="w-10 h-10 aspect-square">
                                            <img
                                                className="bg-offWhite2 w-full h-full rounded-full "
                                                src={mainCourse.img ?? defaultImg}
                                                alt=""
                                                onError={(e) => {
                                                    onImgError(e);
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="flex flex-col justify-between items-left w-8/12 min-h-full leading-4 py-[1px]"
                                            style={{ maxWidth: "200px" }}
                                        >
                                            <h2 id="courseName" className="font-semibold text-[18px] ">
                                                {mainCourse.name}
                                            </h2>
                                            <p className="text-xs truncate cursor-help " title={mainCourse.description}>
                                                {mainCourse.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                                {!mainCourse && (
                                    <div
                                        className="flex flex-col justify-between items-left w-full min-h-full leading-4 py-[1px]"
                                        style={{ maxWidth: "200px" }}
                                    >
                                        <h2 className="font-semibold text-lg ">{`${
                                            courses.length > 0 ? "Select a" : user.userRoleId == 1 ? "Add New" : "Create New"
                                        } Class!`}</h2>
                                    </div>
                                )}
                            </div>
                            {(user.userRoleId == 1 || (user.userRoleId == 3 && courses.length != 0)) && (
                                <>
                                    <Tooltip
                                        id="courses"
                                        place="bottom"
                                        tooltip={
                                            <CoursePopUp
                                                closePopup={() => setIsCoursesPopupOpen(false)}
                                                courses={coursesForPopup}
                                                totalCourses={courses.length}
                                                handleCourseClick={handleCourseClick}
                                                handleCodeSubmit={handleCodeSubmit}
                                                needCode={user.userRoleId == 1}
                                                errorJoinMsg={errorJoinMsg}
                                                successJoinMsg={successJoinMsg}
                                                isLoading={isLoading}
                                                handleSearchChange={handleSearchChange}
                                            />
                                        }
                                        manageOpen
                                        isOpen={isCoursesPopupOpen}
                                        openOnClick
                                        clickable
                                    />
                                    <button
                                        onClick={() => setIsCoursesPopupOpen((prev) => !prev)}
                                        id="coursesPopupBtn"
                                        data-tooltip-id="courses-tooltip"
                                        className="aspect-square p-1 w-1/6 flex justify-center items-center
                                rounded-full
                                hover:bg-bgBlue1 hover:scale-110
                                transition duration-100 ease-in
                                "
                                    >
                                        <DownwardArrow />
                                    </button>
                                </>
                            )}
                        </section>

                        <hr className="border border-blue2" />

                        <section className="p-base leading-4 ">
                            <Menu
                                title="Main Menu"
                                path={path}
                                items={user.userRoleId == 1 ? menuItems : user.userRoleId == 3 ? menuItemsForInstructor : defaultMenuItems}
                            />
                        </section>

                        <hr className="border border-blue2" />

                        <section className="p-base leading-4 ">
                            {mainCourse && <Menu title="Class Menu" path={path} items={revisedClassItems} paramId={mainCourse.classId} noItems={!mainCourse} />}
                        </section>
                    </div>
                </div>
                <div>
                    <div>
                        <section>
                            <div className="p-base flex flex-col gap-2">
                                {subMenus.map((item) => (
                                    <SubMenu key={item.id} item={item} path={path} />
                                ))}
                            </div>
                        </section>

                        <hr className="border border-blue2" />

                        <section id="Account" className="p-base flex flex-row items-center justify-between">
                            <Link
                                to="/accounts"
                                className={`flex flex-row gap-3  
                            rounded-xl cursor-pointer
                            items-center w-3/4 p-2
                            transition-all ease-in duration-150 
                            
                            ${path === "/accounts" ? "bg-green1 font-medium xl:text-md text-white1" : "text-white3 hover:bg-bgBlue1"}
                            `}
                            >
                                <div className="spect-square h-10 w-10 flex justify-center items-center ">
                                    <img
                                        className="bg-offWhite2 w-full h-full rounded-full "
                                        src={profile && profile.profileImg ? profile.profileImg : defaultImg}
                                        alt=""
                                        onError={(e) => {
                                            onImgError(e);
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between items-center ">
                                    <div className="leading-4 w-fit">
                                        <h2 className="font-semibold text-base w-fit ">{profile && `${profile.firstName} ${profile.lastName}`}</h2>
                                        <p className="text-sm w-fit">{profile && profile.role}</p>
                                    </div>
                                </div>
                            </Link>
                            <button
                                id="logOutButton"
                                className="aspect-square p-1 w-1/6 flex justify-center items-center
                            rounded-full
                            hover:bg-bgBlue1 hover:scale-110
                            transition duration-100 ease-in
                            "
                                onClick={(e) => openPopup(e.currentTarget.id)}
                            >
                                <LogOutIcon />
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </nav>
    );
}
