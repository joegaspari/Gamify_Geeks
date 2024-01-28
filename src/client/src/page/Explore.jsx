import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PracticeCard from "../components/PracticeCard";
import { useData } from "../context/DataContext";
import { useToggle } from "../hook/useToggle";
import Leaderboard from "../components/Leaderboard";
import ToggleButton from "../components/ToggleButton";
import ContentHeader from "../components/ContentHeader";
import SelectBox from "../components/InputBox/Select/SelectBox";
import Searchbar from "../components/InputBox/Searchbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ContentBox from "./ContentBox";
import HelpIcon from "../components/icon/HelpIcon";
import { Pagination } from "antd";
import TagsTable from "../components/TagsTable/TagsTable";
import AttemptedQuestionCard from "../components/AttemptedQuestionCard";

// const attemptedQuestions = [
//   {
//     id: 4,
//     startDate: "2023-7-25",
//     textContent: "Test Question",
//     topic: "Hashing",
//     topicId: 2,
//     language: "Java",
//     languageId: 1,
//     difficulty: "Beginner",
//     difficultyId: 3
//   },
//   {
//     id: 28,
//     startDate: "2023-7-25",
//     textContent: "Test Question",
//     topic: "Two Pointers",
//     topicId: 3,
//     language: "Javascript",
//     languageId: 2,
//     difficulty: "Intermediate",
//     difficultyId: 2
//   }
// ]

export default function Explore() {
    const { getLanguages, getDifficulties, getPracticeItems, getUsers, getFilters, getAttemptedQuestions } = useData();

    const topRef = useRef(null);

    // const [sortByCategories, setSortByCategories] = useState([]); // TO DO: Add back after MVP
    // const [statusCategories, setStatusCategories] = useState([]); // TO DO: Add back after MVP
    const [languageCategories, setLanguageCategories] = useState([]);
    // const [difficultyCategories, setDifficultyCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(1);
    const [status, setStatus] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [page, setPage] = useState(1);
    const [pageLength, setPageLength] = useState(10);
    const [totalTopics, setTotalTopics] = useState(0);

    // const [difficulties, setDifficulties] = useState([]);

    const [params, setParams] = useState({ search, options: { sortBy, status }, multiOptions: { languages } });

    const [practiceItems, setPracticeItems] = useState([]);

    const [attemptedQuestions, setAttemptedQuestions] = useState([]);

    const [users, setUsers] = useState([]);

    const [isToggled, toggle] = useToggle();

    useEffect(() => {
        getLanguages().then((i) => setLanguageCategories(i));

        // getDifficulties()
        //   .then((i) => setDifficultyCategories(i));

        getUsers().then((i) => setUsers(i));

        // getFilters()
        //   .then((res) => {
        //     setSortByCategories(res.find((i) => i.id == 1));
        //     setStatusCategories(res.find((i) => i.id == 2));
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        // TODO: Ask team if questions should be pre-loaded based on attempted even if not clicking on attemptedQuestions
        // Choice 1: Only attemptedQuestions box triggers preloading (Custom PAram in URL)
        // Choice 2: Any topic with existing attemptedQuestions triggers preloading (Custom API call in Question Start)

        getAttemptedQuestions().then((i) => setAttemptedQuestions(i));
    }, [getLanguages, getUsers, getFilters, getAttemptedQuestions]);

    useEffect(() => {
        setPage(1);
        setParams({
            search,
            options: {
                sortBy,
                status,
            },
            multiOptions: {
                languages,
                // difficulties
            },
        });
    }, [
        search,
        sortBy,
        status,
        languages,
        // difficulties
    ]);

    useEffect(() => {
        getPracticeItems({ ...params, page, pageLength })
            .then((i) => {
                setPracticeItems(i.topicCards);
                setTotalTopics(i.totalCards);
            })
            .catch((e) => {
                // TODO: Prevent mapping function
                console.log(e);
            });
    }, [params, page, pageLength]);

    const scrollToTop = () => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handlePageChange = (page, pageLength) => {
        setPage(page);
        setPageLength(pageLength);
        scrollToTop();
    };

    return (
        <div ref={topRef}>
            <ContentBox id={"explore"}>
                <MainContent>
                    <ContentHeader title="Practice Problem" subtitle="How about trying something new today?" icons={[{ id: 1, tag: <HelpIcon /> }]} />

                    {/* When browser screen size become narrow, sidebar should be top on practice question cards list */}
                    {/* from this part */}
                    <div className="lg:hidden">
                        <div className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-7">
                            <h1 className="text-2xl font-semibold mb-5">Filters</h1>
                            <Searchbar title="Search" placeholder="What are you looking for?" onSearchChange={setSearch} search={search} />

                            {/* <hr className="bg-white3 my-5" />

              <div className="flex flex-col gap-5">
                {sortByCategories && <SelectBox options={sortByCategories.options} title={sortByCategories.title} handleOption={setSortBy} initialOption={sortBy} />}
                {statusCategories && <SelectBox options={statusCategories.options} title={statusCategories.title} handleOption={setStatus} initialOption={status} needAll />}
              </div> */}

                            <hr className="bg-white3 " />

                            <section>
                                {languageCategories && (
                                    <TagsTable title="Language" items={languageCategories} handleCheckBox={setLanguages} icon checkedItems={languages} />
                                )}
                            </section>

                            {/* <section>
                <TagsTable  title="Difficulty" items={difficultyCategories} handleCheckBox={setDifficulties} theme={'RGB'} checkedItems={difficulties}/>
              </section> */}
                        </div>
                    </div>
                    {/* to this part lg:hidden */}

                    <div className="flex w-full justify-end">
                        <Pagination
                            current={page}
                            defaultCurrent={1}
                            pageSize={pageLength}
                            defaultPageSize={10}
                            onChange={handlePageChange}
                            total={totalTopics}
                            responsive
                        />
                    </div>
                    <section className="flex flex-col gap-5">
                        {practiceItems &&
                            practiceItems.map((item) => {
                                return (
                                    // <Link key={item.id}  to={`/explore/question/${item.id}?title=${item.title}&level=${item.level}`} >
                                    <Link key={item.id} to={`/explore/question/${item.id}?title=${item.title}`}>
                                        {/* theme=true will have rainbow design if there is level */}
                                        <PracticeCard item={item} theme={false} />
                                    </Link>
                                );
                            })}
                    </section>
                    <div className="flex w-full justify-center">
                        <Pagination
                            current={page}
                            defaultCurrent={1}
                            pageSize={pageLength}
                            defaultPageSize={10}
                            onChange={handlePageChange}
                            total={totalTopics}
                            responsive
                        />
                    </div>
                </MainContent>

                <Sidebar>
                    {/* <section>
            <ToggleButton items={[{ id: 1, title: 'Settings' }, { id: 2, title: 'Leaderboard' }]} toggle={toggle} isToggled={isToggled} />
          </section> */}
                    {/* {!isToggled ? ( */}
                    <div className="lg:flex flex-col gap-base hidden">
                        <section>
                            <ExploreFilter setSearch={setSearch} search={search} />
                        </section>

                        <hr className="bg-white3 " />

                        <section>
                            <TagsTable title="Language" items={languageCategories} handleCheckBox={setLanguages} icon checkedItems={languages} />
                        </section>

                        {/* 
              <section>
                <TagsTable title="Difficulty" items={difficultyCategories} theme="RGB" handleCheckBox={setDifficulties} checkedItems={difficulties}/>
              </section> */}
                    </div>
                    {/* ) : (
            <div id='leaderboard-container' className="flex flex-col bg-white1 rounded-[20px] shadow-standard p-base grow overflow-hidden gap-sm">
              <h1 className="text-2xl font-semibold text-black1 grow-0">Top Overall Solvers</h1>
              <div className="flex flex-col grow overflow-hidden">
                <div className="flex flex-col h-full grow rounded-[20px]">
                  {users && <Leaderboard LeaderboardItems={users} />}
                </div>
              </div>
            </div>
          )} */}

                    {attemptedQuestions && attemptedQuestions.length != 0 && (
                        <>
                            <hr className="bg-white3 " />
                            <section>
                                <AttemptedQuestionList attemptedQuestions={attemptedQuestions} />
                            </section>
                        </>
                    )}
                </Sidebar>
            </ContentBox>
        </div>
    );
}

function ExploreFilter({ setSearch, search }) {
    return (
        <div id="settings-container" className="bg-white1 rounded-[20px] shadow-standard p-base">
            <h1 className="text-2xl font-semibold mb-5">Filters</h1>
            <Searchbar title="Search" placeholder="What are you looking for?" onSearchChange={setSearch} search={search} />

            {/* <hr className="bg-white3 my-5" />

      <div className="flex flex-col gap-5">
        {sortByCategories && <SelectBox options={sortByCategories.options} title={sortByCategories.title} handleOption={setSortBy} initialOption={sortBy} />}
        {statusCategories && <SelectBox options={statusCategories.options} title={statusCategories.title} handleOption={setStatus} initialOption={status} needAll />}
      </div> */}
        </div>
    );
}

function AttemptedQuestionList({ attemptedQuestions }) {
    return (
        <div className="grow overflow-y-hidden flex flex-col gap-[20px]">
            <h1 className="font-semibold text-black1 text-2xl">Attempted Questions</h1>
            <div className="grow flex overflow-y-auto flex-col gap-[20px] scroll-hidden rounded-[20px]">
                {attemptedQuestions &&
                    attemptedQuestions.map((item) => {
                        return (
                            // TODO: Ask Joe for level(?)
                            <Link
                                key={item.questionId}
                                to={`/explore/question/${item.topicId}?title=${item.topic}&level=${0}&language=${item.languageId}&difficulty=${
                                    item.difficultyId
                                }&isAttempted=yes`}
                            >
                                <AttemptedQuestionCard item={item} />
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}
