import React, { useEffect, useState } from "react";
import DonutChart from "../components/DonutChart";
import { useNavigate } from "react-router-dom";
import AchievementCard from "../components/AchievementCard";
import { useData } from "../context/DataContext";
import Profile from "../components/Profile";
import Calender from "../components/Calendar/Calender";
import { useToggle } from "../hook/useToggle";
import ToggleCard from "../components/ToggleCard";
import Tooltip from "../components/Tooltip";
import "../index.css";
import { useHelpMode } from "../context/HelpModeContext";
import ContentHeader from "../components/ContentHeader";
import achievementInfos from "../data/achievementInfos";
import ProgressCard from "../components/ProgressCard";
import milestoneStatus from "../data/milestonesStatus.json";
import TopRankCard from "../components/TopRankCard";
import HelpIcon from "../components/icon/HelpIcon";
import NotiIcon from "../components/icon/NotiIcon";
import StarCheck from "../components/icon/check/StarCheck";
import Bookmark from "../components/icon/Bookmark";
import TimeIcon from "../components/icon/TimeIcon";
import Hourglass from "../components/icon/Hourglass";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ContentBox from "./ContentBox";
import NotificationsPopup from "../components/NotificationsPopup";
import TooltipItems from "../components/TooltipItems";
import { useProfile } from "../context/ProfileContext";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProgresssCardEmpty from "../components/ProgressCardEmpty";
import Timer from "../components/Timer";

const icons = [<StarCheck />, <Bookmark />, <TimeIcon />, <Hourglass />];

const achievementDescription = achievementInfos.map((i, index) => ({
    ...i,
    icon: icons[index],
}));

export default function DashBoard() {
    const {
        getAchievementRate,
        getMilestones,
        getProfile,
        getTooltipItems,
        getMasteries,
        getUsers,
        getNotificationData,
        getLeaderboardItems,
        getBadges,
        getTotalStreaks,
        getMonthStreaks,
        getNotifications,
        claimNotification,
    } = useData();

    const [notificationData, setNotificationData] = useState([]);
    const [achievementRateItems, setAchievementRateItems] = useState(null);
    const [milestoneItems, setMilestoneItems] = useState(null);
    const [milestoneItemsToFill, setMilestonesItemsToFill] = useState(6);
    const [masteries, setMasteries] = useState(null);
    const [badges, setBadges] = useState(null);
    const [totalStreaks, setTotalStreaks] = useState(null);
    const [monthStreaks, setMonthStreaks] = useState(null);
    const [date, setDate] = useState({ year: null, month: null });
    const [notifications, setNotifications] = useState(null);

    const { studentId } = useParams();
    const { profile: myProfile } = useProfile();

    const [profile, setProfile] = useState();
    useEffect(() => {
        console.log(profile);
        if (myProfile) {
            setProfile(myProfile);
        }
    }, [myProfile]);
    const [isToggled, toggle] = useToggle();
    const [leaderboardItems, setLeaderboardItems] = useState([]);

    const [tooltipItems, setTooltipItems] = useState(null);
    const { isHelpModeActive, toggleHelpMode } = useHelpMode();

    useEffect(() => {
        getAchievementRate().then((items) => {
            const revisedItem = items.map((item) => ({
                id: item.id,
                rate: item.rate,
                num: item.num,
            }));

            setAchievementRateItems(revisedItem);
        });

        getMilestones().then((i) => {
            console.log("MILESTONES");
            console.log(i);
            setMilestoneItems(i);
        });

        getMasteries().then((i) => {
            setMasteries(i);
        });

        getBadges().then((i) => {
            setBadges(i);
        });

        getTooltipItems().then((i) => setTooltipItems(i));

        getLeaderboardItems().then((i) => setLeaderboardItems(i));

        getNotificationData().then((i) => {
            console.log(i);
        });

        getTotalStreaks().then((i) => {
            console.log("TOTAL STREAKS");
            console.log(i);
            setTotalStreaks(i.streakCount);
        });

        getNotifications().then((i) => {
            console.log(i);
            setNotifications(i);
        });
    }, [getAchievementRate, getMilestones, getTooltipItems, getMasteries, getUsers, getNotificationData, getTotalStreaks, getNotifications]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!studentId) return;
        getProfile(studentId)
            .then((i) => setProfile(i))
            .catch((e) => {
                navigate("/dashboard");
            });

        getAchievementRate(studentId)
            .then((i) => setAchievementRateItems(i))
            .catch((e) => {
                console.log(e);
            });

        getMilestones(studentId)
            .then((i) => {
                console.log(i);
                setMilestoneItems(i);
            })
            .catch((e) => {
                console.log(e);
            });

        getMasteries(studentId)
            .then((i) => setMasteries(i))
            .catch((e) => {
                console.log(e);
            });

        getBadges(studentId)
            .then((i) => {
                console.log(i);
                setBadges(i);
            })
            .catch((e) => {
                console.log(e);
            });

        getTotalStreaks(studentId).then((i) => {
            console.log(i);
            setTotalStreaks(i.streakCount);
        });
    }, [studentId, myProfile, getProfile]);

    useEffect(() => {
        milestoneItems && setMilestonesItemsToFill(6 - milestoneItems.length);
    }, [milestoneItems]);

    useEffect(() => {
        if (date.year == null || date.month == null) return;

        getMonthStreaks({ studentId, year: date.year, month: date.month }).then((i) => {
            console.log("monthStreaks");
            console.log(i);
            setMonthStreaks(i);
        });
    }, [getMonthStreaks, studentId, date]);

    const handleChangeDate = (dateInfo) => {
        setDate(dateInfo);
    };

    const handleClaimBadge = (badge) => {
        claimNotification(badge.id).then((i) => {
            setNotifications((prev) => prev.filter((item) => item.id !== badge.id));
        });
    };

    return (
        <ContentBox id={"dashboard"}>
            <MainContent>
                <div>
                    <ContentHeader
                        title={studentId ? `${profile && `${profile.username}'s `} Dashboard` : `Hey${profile && `, ${profile.username}`}!`}
                        subtitle="What are you planning today?"
                        icons={[
                            { id: 1, onClick: toggleHelpMode, tag: <HelpIcon />, elemId: "toggleHelpBtn", aboveOverlay: isHelpModeActive },
                            ...(!studentId
                                ? [
                                    {
                                        id: 2,
                                        tag: (
                                            <div
                                                data-tooltip-id="notifications-tooltip"
                                                id="notifications"
                                                className="relative w-full h-full flex justify-center items-center"
                                            >
                                                {notifications && notifications.length !== 0 && (
                                                    <div className="absolute top-2 right-2 bg-bgRed1 h-1/4 w-1/4 rounded-full" />
                                                )}
                                                <NotiIcon />
                                            </div>
                                        ),
                                    },
                                ]
                                : []),
                        ]}
                    />
                </div>

                <section
                    data-tooltip-id="overview-tooltip"
                    id="overview"
                    className={`${isHelpModeActive && "hasHelp"
                        } shadow-standard lg-h-[280px] flex sm:flex-row flex-col items-center bg-white1 rounded-[20px] p-base gap-base`}
                >
                    <div className="md:w-1/4 w-fit aspect-square flex items-center justify-center h-full">
                        {achievementRateItems && <DonutChart item={achievementRateItems.find((item) => item.id === 1)} title="Solve Rate" />}
                    </div>
                    <div className="h-full md:w-3/4 w-full grid grid-cols-1 md:grid-cols-2 gap-sm ">
                        {achievementRateItems &&
                            achievementRateItems.map((item, index) => (
                                <AchievementCard key={item.id} item={item} description={achievementDescription[index]} />
                            ))}
                    </div>
                </section>

                <section className="mt-sm" id="milestones">
                    <div></div>
                    <h1 className="font-bold text-[40px] text-black1 mb-base">Upcoming Milestones{/* - <Timer /> */}</h1>
                    <div className="grid milestone-grid gap-base">
                        {milestoneItems &&
                            milestoneItems.map((item) => (
                                <div key={item.id} id={`milestone-${item.id}-tooltip`}>
                                    <ProgressCard item={item} status={milestoneStatus} onClick={() => navigate("/explore")} />
                                    {tooltipItems && (
                                        <Tooltip id={`milestone-${item.id}`} tooltip={<TooltipItems items={tooltipItems.milestone} />} forHelpMode />
                                    )}
                                </div>
                            ))}
                        {milestoneItems &&
                            milestoneItemsToFill > 0 &&
                            Array(milestoneItemsToFill)
                                .fill(0)
                                .map((item, index) => <ProgresssCardEmpty key={index} />)}
                    </div>
                </section>

                <section data-tooltip-id="topMasteries-tooltip" id="topMasteries" className={`${isHelpModeActive && "hasHelp"} rounded-[20px] h-fit`}>
                    {masteries && <TopRankCard items={masteries} title="Top Masteries" />}
                </section>
            </MainContent>
            <Sidebar styles={`${isHelpModeActive && "bgOverlay"} lg:flex grid md:grid-cols-2 sm:grid-cols-1`}>
                <section data-tooltip-id="accountCard-tooltip" id="accountCard">
                    {profile && <Profile profile={profile} totalStreaks={totalStreaks} />}
                </section>

                <section data-tooltip-id="calendar-tooltip" id="calendar">
                    {profile && <Calender monthStreaks={monthStreaks} handleChangeDate={handleChangeDate} />}
                </section>

                <section data-tooltip-id="badges-tooltip" id="badges">
                    {
                        <ToggleCard
                            dependancy={{ leaderboardItems, badges }}
                            items={[
                                { id: 1, title: "Badges" },
                                { id: 2, title: "Leaderboard" },
                            ]}
                            toggle={toggle}
                            isToggled={isToggled}
                        />
                    }
                </section>
            </Sidebar>
            {
                // Refactor for tooltips to have components as children element
                // Refactor position algorithm to take the screen as context
                tooltipItems && (
                    <>
                        <Tooltip id="overview" tooltip={<TooltipItems items={tooltipItems.overview} />} forHelpMode />
                        <Tooltip id="topMasteries" tooltip={<TooltipItems items={tooltipItems.topMasteries} />} forHelpMode />
                        <Tooltip id="accountCard" tooltip={<TooltipItems items={tooltipItems.accountCard} />} forHelpMode />
                        <Tooltip id="calendar" tooltip={<TooltipItems items={tooltipItems.calendar} />} forHelpMode />
                        <Tooltip id="badges" tooltip={<TooltipItems items={tooltipItems.badges} />} forHelpMode />
                    </>
                )
            }
            {notifications && (
                <Tooltip
                    id="notifications"
                    tooltip={<NotificationsPopup notificationData={notifications} handleClaimBadge={handleClaimBadge} />}
                    place="bottom"
                    clickable
                />
            )}
        </ContentBox>
    );
}
