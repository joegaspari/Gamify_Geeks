import React, { useCallback, useEffect, useState } from "react";
import AchievementCard from "../components/AchievementCard";
import ContentHeader from "../components/ContentHeader";
import { useData } from "../context/DataContext";
import Leaderboard from "../components/Leaderboard";
import analyticsInfos from "../data/analyticsInfos";
import ProgresssCard from "../components/ProgressCard";
import assignmentStatus from "../data/assignmentStatus.json";
import TopRankCard from "../components/TopRankCard";
import BarChart from "../components/BarChart";
import HelpIcon from "../components/icon/HelpIcon";
import NotiIcon from "../components/icon/NotiIcon";
import PeopleIcon from "../components/icon/PeopleIcon";
import SmallStarCheck from "../components/icon/check/SmallStarCheck";
import Dumbbell from "../components/icon/Dumbbell";
import FadeClock from "../components/icon/FadeClock";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ContentBox from "./ContentBox";
import { useProfile } from "../context/ProfileContext";
import { useNavigate, useParams } from "react-router-dom";
import ProgresssCardEmpty from "../components/ProgressCardEmpty";

const icons = [<PeopleIcon />, <SmallStarCheck />, <Dumbbell />, <FadeClock />];

const analyticsDescription = analyticsInfos.map((i, index) => ({
    ...i,
    icon: icons[index],
}));

export default function Analytics() {
    const {
        getClassLeaderboard,
        getWeekProgress,
        getStudentAnalytics,
        getClassLeaderboardInstructor,
        getWeekProgressInstructor,
        getStudentAnalyticsInstructor,
        getUpcomingAssignments,
    } = useData();

    const { mainCourse, profile } = useProfile();
    const { studentId } = useParams();

    const [analyticsData, setAnalyticsData] = useState(null);
    const [assignments, setAssignments] = useState(null);
    const [users, setUsers] = useState([]);
    const [weekProgress, setWeekProgress] = useState(null);
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        if (mainCourse && profile && profile.userRoleId) {
            if (profile.userRoleId == 3) {
                handleGetInstructorData();
            } else {
                handleGetStudentData();
            }
        }
    }, [mainCourse, profile, studentId]);

    const handleGetInstructorData = async () => {
        try {
            const data = await getStudentAnalyticsInstructor(mainCourse.classId);
            setAnalyticsData(data);
        } catch (e) {
            navigate(`/class/${mainCourse.classId}/analytics`);
            return;
        }

        getWeekProgressInstructor(mainCourse.classId).then((i) => {
            setWeekProgress(i);
        });

        getClassLeaderboardInstructor(mainCourse.classId).then((i) => {
            setUsers(i);
        });
    };

    const handleGetStudentData = async () => {
        try {
            const data = await getStudentAnalytics({ classId: mainCourse.classId, studentId });
            setAnalyticsData(data);
        } catch (e) {
            navigate(`/class/${mainCourse.classId}/analytics`);
            return;
        }

        getWeekProgress({ classId: mainCourse.classId, studentId }).then((i) => {
            setWeekProgress(i);
        });

        getClassLeaderboard({ classId: mainCourse.classId, studentId }).then((i) => {
            setUsers(i);
        });

        getUpcomingAssignments({ classId: mainCourse.classId, studentId }).then((i) => {
            setAssignments(i);
        });
    };

    useEffect(() => {
        const results = users.slice(0, 4).map((user) => ({
            ...user,
            title: user.name,
        }));
        setTopUsers(results);
    }, [users]);

    const navigate = useNavigate();
    const handleUserRowClick = (userId) => {
        navigate(`/class/${mainCourse.classId}/analytics/${userId}`);
    };

    return (
        <ContentBox id={"analytics"}>
            <MainContent>
                <div className="flex flex-col gap-5">
                    <ContentHeader
                        title="Class Analytics"
                        subtitle="How is your class doing?"
                        icons={[
                            { id: 1, tag: <HelpIcon /> },
                            { id: 2, tag: <NotiIcon /> },
                        ]}
                    />

                    <section
                        id="overview"
                        className="flex md:flex-row flex-col items-center bg-white1 rounded-[20px] shadow-standard p-base gap-base md:h-[260px]"
                    >
                        <div className="md:w-1/2 w-full grid sm:grid-cols-2 grid-cols-1 md:gap-4 gap-3 h-full">
                            {analyticsData &&
                                analyticsData.map((item, index) => <AchievementCard key={item.id} item={item} description={analyticsDescription[index]} />)}
                        </div>
                        <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center">
                            {weekProgress && <BarChart items={weekProgress} title="Class Progress" />}
                        </div>
                    </section>
                </div>

                {assignments && assignments.length > 0 && (
                    <section id="assignments" className="mt-sm">
                        <h1 className="font-bold lg:text-4xl text-black1 mb-base">Upcoming Assignments</h1>
                        <div className="grid milestone-grid gap-base">
                            {console.log(assignments)}
                            {assignments.map((item) => (
                                <ProgresssCard
                                    key={item.id}
                                    item={item}
                                    status={assignmentStatus}
                                    onClick={() => navigate(`/class/${profile.userId}/modules`)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section id="topStudents">
                    <TopRankCard title="Top Students" items={topUsers} />
                </section>
            </MainContent>

            <Sidebar>
                <div className="flex flex-col bg-white1 rounded-[20px] shadow-standard p-base grow overflow-hidden gap-sm">
                    <h1 className="text-2xl font-semibold text-black1 grow-0">Class Leaderboard</h1>
                    <div id="leaderboard" className="flex flex-col grow overflow-hidden">
                        {/* //when width become narrow, h1 get to have 2 line so need to make small responsively */}
                        <div className="flex flex-col h-full grow rounded-[20px]">
                            {users && <Leaderboard LeaderboardItems={users} handleUserRowClick={handleUserRowClick} />}
                        </div>
                    </div>
                </div>
            </Sidebar>
        </ContentBox>
    );
}
