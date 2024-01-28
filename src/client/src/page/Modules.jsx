import React, { useEffect, useState, useCallback } from "react";

import { useData } from "../context/DataContext";
import ContentHeader from "../components/ContentHeader";
import HelpIcon from "../components/icon/HelpIcon";
import SelectBox from "../components/InputBox/Select/SelectBox";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ContentBox from "./ContentBox";

import ModuleBoxForStudent from "../components/ModuleBoxForStudent";
import LockedSelectBox from "../components/InputBox/Select/LockSelectBox";

import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

export default function Modules(props) {
    //     /////////////////////////////////////////////////////////////////////////////////
    // Main content
    /// /////////////////////////////////////////////////////////////////////

    const [selectedAssignmentId, setSelectedAssignmentId] = useState({ moduleId: null, assignmentId: null });
    const [selectedAssignmentDetails, setSelectedAssignmentDetails] = useState(null);
    const { mainCourse } = useProfile();
    const { getStudentModules } = useData();
    const [modulesData, setModulesData] = useState(null);

    useEffect(() => {
        if (!modulesData || !selectedAssignmentId) {
            return;
        }
        console.log(selectedAssignmentId);

        const { moduleId, assignmentId } = selectedAssignmentId;
        setSelectedAssignmentDetails(() => {
            return modulesData.find((i) => i.id === moduleId).assignments.find((i) => i.id === assignmentId);
        });
    }, [selectedAssignmentId]);

    const [boxesStatus, setBoxesStatus] = useState({});

    const toggleBox = useCallback((id) => {
        setBoxesStatus((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    useEffect(() => {
        mainCourse &&
            getStudentModules({ classId: mainCourse.classId }).then((i) => {
                setModulesData(i);
            });
    }, [mainCourse, getStudentModules]);

    useEffect(() => {}, [selectedAssignmentDetails]);

    return (
        <ContentBox id={"modules"}>
            <MainContent styles="gap-8">
                <ContentHeader title="Class Modules" subtitle="You Instructor added a new module!" icons={[{ id: 1, tag: <HelpIcon /> }]} />

                <ModuleBoxForStudent
                    modulesData={modulesData}
                    boxesStatus={boxesStatus}
                    toggleBox={toggleBox}
                    selectedAssignmentId={selectedAssignmentId}
                    setSelectedAssignmentId={setSelectedAssignmentId}
                    selectable
                />
            </MainContent>

            <Sidebar>
                <section>
                    <div id="details-container" className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-5">
                        <h1 className="text-3xl font-semibold">Details</h1>
                        {selectedAssignmentDetails ? (
                            <>
                                <LockedSelectBox title="Assignment Type" value={selectedAssignmentDetails.name} />
                                <LockedSelectBox title="Number Of Questions" value={selectedAssignmentDetails.numberOfQuestions} />

                                <hr className="bg-white3 " />

                                <LockedSelectBox title="Topic" value={selectedAssignmentDetails.name} />
                                <LockedSelectBox title="Difficulty" value={selectedAssignmentDetails.difficulty} />
                                <LockedSelectBox title="Language" value={selectedAssignmentDetails.language} />
                            </>
                        ) : (
                            <p id="default-text">Please select any of your instructor's assignments to view the details and get started!</p>
                        )}
                    </div>
                </section>
                {selectedAssignmentDetails && (
                    <>
                        <section>
                            <div className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-4">
                                <h1 className="text-3xl font-semibold">Sample</h1>
                                <div className="text-lg leading-7	text-black1 flex flex-col gap-4">{selectedAssignmentDetails.sampleQuestion}</div>
                            </div>
                        </section>

                        <section>
                            <div className="mt-3 flex justify-end items-center">
                                {(() => {
                                    if (!selectedAssignmentDetails) return;
                                    const { topicId, topic, langId, diffId, id } = selectedAssignmentDetails;

                                    return (
                                        <Link to={`/explore/question/${topicId}?title=${topic}&language=${langId}&difficulty=${diffId}&assignment=${id}`}>
                                            <div
                                                id="startAssignmentBtn"
                                                className="px-10 py-1 text-lg font-semibold text text-white1 rounded-lg ease-out duration-200 hover:scale-110 cursor-pointer bg-bgGreen1"
                                            >
                                                Get Started
                                            </div>
                                        </Link>
                                    );
                                })()}
                            </div>
                        </section>
                    </>
                )}
            </Sidebar>
        </ContentBox>
    );
}
