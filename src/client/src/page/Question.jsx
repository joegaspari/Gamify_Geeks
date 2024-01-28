import React, { useEffect, useState } from "react";
import { useToggle } from "../hook/useToggle";
import Leaderboard from "../components/Leaderboard";
import ToggleButton from "../components/ToggleButton";
import ContentHeader from "../components/ContentHeader";
import { useData } from "../context/DataContext";
import EmbeddedIDE from "../components/EmbeddedIDE";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ContentBox from "./ContentBox";
import ProgressPopup from "../components/ProgressPopup";
import { usePopup } from "../context/PopupContext";
import ReportPopup from "../components/ReportPopup";
import FeedbackPopup from "../components/FeedbackPopup";
import PopupOverlay from "../components/PopupOverlay";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
import languageList from "../data/languageList";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import HelpIcon from "../components/icon/HelpIcon";
import { useLoading } from "../hook/useLoading";
import HintPopup from "../components/HintPopup";
import QuestionDetailsCard from "../components/QuestionDetailsCard";
import Toast from "../components/Toast";
import ConfirmReset from "../components/ConfirmReset";
import { useProfile } from "../context/ProfileContext";

const customToast = {
    borderRadius: "10px",
    margin: "0 0 10px 0",
    padding: "0",
    height: "fit-content",
    width: "fit-content",
};

const customToastBody = {
    margin: "0",
    padding: "0",
    height: "fit-content",
    width: "fit-content",
};

export default function Question(props) {
    const params = useParams();
    const topicId = params.topicId;
    const [searchParams] = useSearchParams();

    const title = searchParams.get("title");
    const level = searchParams.get("level");

    const isAttempted = searchParams.get("isAttempted");

    const initialLanguage = searchParams.get("language") || "";
    const initialDifficulty = searchParams.get("difficulty") || "";
    const assignmentId = searchParams.get("assignment");
    const [isAssignment, setIsAssignment] = useState(false);

    const {
        getTopicLanguages,
        getDifficulties,
        getQuestion,
        submitAnswer,
        saveAnswer,
        getHint,
        reportQuestion,
        getStudentQuestions,
        saveAssignmentQuestion,
        submitAssignmentAnswer,
    } = useData();
    const { popups, closePopup, openPopup } = usePopup();
    const { mainCourse } = useProfile();

    const [language, setLanguage] = useState(initialLanguage);
    const [codeMirrorLanguage, setCodeMirrorLanguage] = useState(languageList[0]);
    const [difficulty, setDifficulty] = useState(initialDifficulty);
    const [difficulties, setDifficulties] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [code, setCode] = useState("");

    const [question, setQuestion] = useState(null);
    const [questionList, setQuestionList] = useState(null);

    const [feedback, setFeedback] = useState(null);
    const [hint, setHint] = useState(null);

    const [isToggled, toggle] = useToggle();

    const [progressData, setProgressData] = useState([]);

    const { isLoading, startLoading, stopLoading, loadingComponent } = useLoading({ iso: true });

    useEffect(() => {
        getTopicLanguages(topicId).then((i) => {
            setLanguages(i);
            setLanguage(initialLanguage ? initialLanguage : i[0].id);
        });

        getDifficulties(topicId).then((i) => {
            setDifficulties(i);
            setDifficulty(initialDifficulty ? initialDifficulty : i[0].id);
        });

        isAttempted === "yes" && handleGenerateQuestion();
    }, [getTopicLanguages, getDifficulties, isAttempted]);

    useEffect(() => {
        if (isAssignment) {
            const params = {
                classId: mainCourse.classId,
                assignmentId: Number(assignmentId),
            };
            getStudentQuestions(params)
                .then((i) => {
                    console.log(i.error);
                    if (!i.error) {
                        setQuestionList(i);
                        const incompleteQuestions = i.filter((question) => question.status != 3);
                        if (incompleteQuestions.length > 0) {
                            changeQuestion(incompleteQuestions[0]);
                        } else {
                            changeQuestion(i[0]);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [isAssignment]);

    useEffect(() => {
        setIsAssignment(assignmentId != null);
    }, []);

    const handleSaveAnswer = () => {
        const id = question.id;
        const answer = code;

        if (isAssignment) {
            console.log(id, answer, assignmentId);
            saveAssignmentQuestion({ questionId: id, textContent: answer, assignmentId: assignmentId })
                .then((i) => {
                    showCustomToast(0, "Saved Successfully", "Progress tracked, you can now exit safely!");
                })
                .catch((err) => {
                    showCustomToast(2, "Save Failed", "Something went wrong, please try again!");
                });
        } else {
            saveAnswer({ id, answer })
                .then((i) => {
                    showCustomToast(0, "Saved Successfully", "Progress tracked, you can now exit safely!");
                })
                .catch((err) => {
                    showCustomToast(2, "Save Failed", "Something went wrong, please try again!");
                });
        }
    };

    const closeReportPopup = () => {
        closePopup("reportPopup");
    };
    const closeFeedbackPopup = () => {
        closePopup("feedbackPopup");
    };
    const closeProgressPopup = () => {
        closePopup("progressPopup");
        if (isAssignment) {
            this.forceUpdate();
            return;
        }
        handleGenerateQuestion();
        setCode("");
    };
    const closeHintPopup = () => {
        closePopup("hintPopup");
    };
    const confirmReset = () => {
        setCode("");
        closePopup("confirmReset");
    };
    const cancelReset = () => {
        closePopup("confirmReset");
    };

    useEffect(() => {
        if (languages.length == 0) {
            return;
        }

        if (initialLanguage) {
            const languageDetails = languages.find((language) => language.id == initialLanguage);
            setLanguage(initialLanguage);
            setCodeMirrorLanguage(languageList[languageDetails.name]);
        } else {
            setCodeMirrorLanguage(languageList[languages[0].name]);
        }
    }, [languages, initialLanguage]);

    const handleLanguageChange = (option) => {
        const languageDetails = languages.find((language) => language.id == option);
        setLanguage(option);
        setCodeMirrorLanguage(languageList[languageDetails.name]);
    };

    const handleDifficultyChange = (option) => {
        setDifficulty(option);
    };

    const showCustomToast = (status, title, subTitle, timeout = 1500) => {
        toast(<Toast status={status} title={title} subTitle={subTitle} />, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: timeout,
            hideProgressBar: true,
            closeButton: false,
            style: customToast,
            bodyStyle: customToastBody,
        });
    };

    const changeQuestion = (params) => {
        const { id, textContent, partialAnswer } = params;

        toggle();
        setQuestion({
            id: id,
            textContent: textContent,
        });
        setCode(partialAnswer ? partialAnswer : "");
        setFeedback("");
        setHint("");
    };

    const handleGenerateQuestion = async () => {
        const questionReader = await getQuestion({ topicId, language, difficulty });

        const decoder = new TextDecoder("utf-8");

        setQuestion({
            textContent: "",
        });
        setFeedback("");

        while (true) {
            const { done, value } = await questionReader.read();
            if (done) {
                break;
            }

            // Massage and parse the chunk of data
            const chunks = decoder.decode(value);
            const parsedChunks = chunks.trim("\n").split("\n\n");

            for (const parsedChunk of parsedChunks) {
                const JSONChunk = JSON.parse(parsedChunk);

                if (JSONChunk.existing) {
                    setQuestion(JSONChunk);
                    const partialAnswer = JSONChunk.partialAnswer == null ? "" : JSONChunk.partialAnswer;
                    setCode(partialAnswer);
                    break;
                }
                if (JSONChunk.textContent) {
                    setQuestion((prev) => {
                        return {
                            ...prev,
                            textContent: prev.textContent + JSONChunk.textContent,
                        };
                    });
                }
                if (JSONChunk.id) {
                    setQuestion((prev) => {
                        return {
                            ...prev,
                            id: JSONChunk.id,
                        };
                    });
                    break;
                }
                if (JSONChunk.repeat) {
                    setQuestion({
                        textContent: "",
                    });
                }
            }
        }
    };

    const handleSubmitAnswer = async () => {
        const id = question.id;
        const answer = code;

        var reader;

        if (!isAssignment) {
            reader = await submitAnswer({ id, answer });
        } else {
            reader = await submitAssignmentAnswer({ id, answer, assignmentId });
        }

        const decoder = new TextDecoder("utf-8");

        var foundCorrectness = false;
        setFeedback("");
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            // Massage and parse the chunk of data
            const chunks = decoder.decode(value);
            const parsedChunks = chunks.trim("\n").split("\n\n");

            for (const parsedChunk of parsedChunks) {
                const JSONChunk = JSON.parse(parsedChunk);

                console.log(JSONChunk);
                if (JSONChunk.error) {
                    setFeedback(JSONChunk.error);
                }

                if (foundCorrectness) {
                    if (JSONChunk.feedback) {
                        setFeedback((prev) => prev + JSONChunk.feedback);
                    } else if (JSONChunk.progress) {
                        setProgressData(JSONChunk.data);
                    }
                } else {
                    if (JSONChunk.correct != undefined) {
                        if (JSONChunk.correct == true) {
                            openPopup("progressPopup");
                        } else {
                            openPopup("feedbackPopup");
                        }
                        foundCorrectness = true;
                    }
                }
            }
        }
    };

    const handleGetHint = async () => {
        setHint("");
        openPopup("hintPopup");
        const reader = await getHint(question.id);
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            // Massage and parse the chunk of data
            const chunks = decoder.decode(value);
            const parsedChunks = chunks.trim("\n").split("\n\n");

            for (const parsedChunk of parsedChunks) {
                const JSONChunk = JSON.parse(parsedChunk);

                if (JSONChunk.error) {
                    setHint(JSONChunk.error);
                    break;
                }
                if (JSONChunk.hint) {
                    setHint((prev) => (prev += JSONChunk.hint));
                }
            }
        }
    };

    const handleReportQuestion = async () => {
        await reportQuestion(question.id);
    };

    return (
        <ContentBox id={"question"}>
            <MainContent>
                <ContentHeader
                    title={`${title} ${level != null ? ` - Level ${level}` : ""}`}
                    subtitle="You are so close to the Next Level!"
                    icons={[{ id: 1, tag: <HelpIcon /> }]}
                />

                {/* for responsive */}
                <div className="lg:hidden">
                    <section>
                        <QuestionBox question={question} />
                    </section>

                    {feedback && (
                        <section>
                            <div className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-4">
                                <h1 className="text-3xl font-semibold">Feedback</h1>
                                <div className="text-lg leading-7	text-black1 flex flex-col gap-4">
                                    <p>{feedback}</p>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className="flex flex-col gap-base" style={{ maxHeight: "calc(100vh - 150px)" }}>
                    {languages && (
                        <EmbeddedIDE
                            languages={languages}
                            difficulties={difficulties}
                            question={question}
                            handleLanguageChange={handleLanguageChange}
                            handleDifficultyChange={handleDifficultyChange}
                            language={language}
                            codeMirrorLanguage={codeMirrorLanguage}
                            difficulty={difficulty}
                            setCode={setCode}
                            code={code}
                            openConfirmReset={() => openPopup("confirmReset")}
                            handleGenerateQuestion={handleGenerateQuestion}
                            handleSaveAnswer={handleSaveAnswer}
                            isLoading={isLoading}
                            modifiable={!isAssignment}
                        />
                    )}

                    {question && question.id && (
                        <section>
                            <div className="bg-white1 rounded-[20px] shadow-md flex justify-between items-center p-sm">
                                <div className="text-3xl font-semibold">
                                    <div
                                        id="reportPopup"
                                        onClick={(e) => openPopup(e.currentTarget.id)}
                                        className="px-base py-1.5 text-lg font-semibold text text-white1 rounded-lg ease-out duration-200 hover:scale-110 cursor-pointer bg-bgRed1 active:bg-red-700"
                                    >
                                        Report
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div
                                        id="hintPopup"
                                        onClick={handleGetHint}
                                        className="px-base py-1.5 text-lg font-semibold text text-white1 rounded-lg ease-out duration-200 hover:scale-110 cursor-pointer bg-bgBlue1 active:bg-blue-700"
                                    >
                                        Hint
                                    </div>
                                    <div
                                        id="progressPopup"
                                        onClick={handleSubmitAnswer}
                                        className="px-base py-1.5 text-lg font-semibold text text-white1 rounded-lg ease-out duration-200 hover:scale-110 cursor-pointer bg-bgGreen1 active:bg-green-700"
                                    >
                                        Submit
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </MainContent>

            <Sidebar>
                {isAssignment && (
                    <section className="lg:block hidden">
                        <ToggleButton
                            items={[
                                { id: 1, title: "Details" },
                                { id: 2, title: "Question List" },
                            ]}
                            toggle={toggle}
                            isToggled={isToggled}
                        />
                    </section>
                )}
                {!isToggled ? (
                    <div id="questions-container" className="lg:flex hidden flex-col gap-[30px]">
                        <section>
                            <QuestionBox question={question} />
                        </section>

                        {feedback && (
                            <section>
                                <div className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-4">
                                    <h1 className="text-3xl font-semibold">Feedback</h1>
                                    <div className="text-base	text-black1 flex flex-col gap-4 whitespace-pre-line">
                                        <p id="savedFeedback">{feedback}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {hint && (
                            <section>
                                <div className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-4">
                                    <h1 className="text-3xl font-semibold">Hint</h1>
                                    <div className="text-base	text-black1 flex flex-col gap-4 whitespace-pre-line">
                                        <p id="savedFeedback">{hint}</p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    // (
                    //   <div id='leaderboard-container' className="bg-white1 rounded-2xl shadow-md p-6 h-full ">
                    //     {/* //when width become narrow, h1 get to have 2 line so need to make small responsively */}
                    //     <h1 className=" text-2xl font-semibold text-black1 mb-4 ">Top Overall Solvers</h1>
                    //     <div className=" h-[92%] rounded-2xl overflow-scroll scroll-hidden">
                    //       {users && <Leaderboard LeaderboardItems={users} /> }
                    //     </div>
                    //   </div>
                    // )
                    <>
                        {questionList &&
                            questionList.length != 0 &&
                            questionList.map((questionData, index) => (
                                <React.Fragment key={questionData.id}>
                                    <QuestionDetailsCard questionData={questionData} changeQuestion={changeQuestion} index={index} />
                                </React.Fragment>
                            ))}
                    </>
                )}

                <section className="lg:hidden flex flex-col gap-base p-base">
                    <h1 className={`text-black1 font-semibold text-3xl`}>{`Question List`}</h1>
                    <div className="overflow-y-auto scroll-hidden">
                        {questionList &&
                            questionList.map((questionData) => (
                                <React.Fragment key={questionData.id}>
                                    <QuestionDetailsCard questionData={questionData} changeQuestion={changeQuestion} />
                                </React.Fragment>
                            ))}
                    </div>
                </section>
            </Sidebar>
            {popups.reportPopup && (
                <PopupOverlay closePopup={closeReportPopup}>
                    <ReportPopup closePopup={closeReportPopup} handleReportQuestion={handleReportQuestion} />
                </PopupOverlay>
            )}
            {popups.feedbackPopup && (
                <PopupOverlay closePopup={closeFeedbackPopup}>
                    <FeedbackPopup closePopup={closeFeedbackPopup} feedback={feedback} />
                </PopupOverlay>
            )}
            {popups.progressPopup && (
                <PopupOverlay closePopup={closeProgressPopup}>
                    <ProgressPopup closePopup={closeProgressPopup} progressData={progressData} />
                </PopupOverlay>
            )}
            {popups.hintPopup && (
                <PopupOverlay closePopup={closeHintPopup}>
                    <HintPopup closePopup={closeHintPopup} hint={hint} />
                </PopupOverlay>
            )}
            {popups.confirmReset && (
                <PopupOverlay closePopup={cancelReset}>
                    <ConfirmReset confirmReset={confirmReset} cancelReset={cancelReset} />
                </PopupOverlay>
            )}
        </ContentBox>
    );
}

function QuestionBox({ question }) {
    return (
        <div className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-4 overflow-x-auto">
            <h1 className="text-3xl font-semibold">Question</h1>
            <div id="questionDetails" className="text-base	text-black1 flex flex-col gap-4 whitespace-pre-line">
                {/* {
          !isLoading ? <p className={`${question && question.error && "text-bgRed1"}`}>{question ? question.textContent : "Select language & difficulty then generate a question!"}</p>
          :loadingComponent
        } */}
                <ReactMarkdown>{question ? question.textContent : "Select language & difficulty then generate a question!"}</ReactMarkdown>
            </div>
        </div>
    );
}
