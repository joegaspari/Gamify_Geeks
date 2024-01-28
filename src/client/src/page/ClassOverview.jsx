import React, { useEffect, useState } from 'react';
import ContentBox from './ContentBox';
import MainContent from './MainContent';
import ContentHeader from '../components/ContentHeader';
import PlusIcon from '../components/icon/Plus/PlusIcon';
import HelpIcon from '../components/icon/HelpIcon';
import Sidebar from './Sidebar';
import ClassCard from '../components/ClassCard';
import Bookmark from '../components/icon/Bookmark';
import { useData } from '../context/DataContext';
import Searchbar from '../components/InputBox/Searchbar';
import CreateClassCard from '../components/CreateClassCard';
import { useProfile } from '../context/ProfileContext';



const ClassOverview = (props) => {


    const { getClassOverview, createClass, editClass, deleteClass } = useData();
    const { updateClasses } = useProfile();

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        getClassOverview()
            .then((i) => {
                console.log(i);
                setClasses(i);
            });
    }, [getClassOverview]);




    const [isCreateBtnClicked, setIsCreateBtnClicked] = useState(false);
    const [newClassInfo, setNewClassInfo] = useState({ name: "", description: "" });
    const [isError, setIsError] = useState(false);
    const [createClassMsg, setCreateClassMsg] = useState('');
    const [intervalId, setIntervalId] = useState(null);

    const openClassTemplate = () => {
        setCreateClassMsg('');
        setIsError(false);
        setIsCreateBtnClicked(true);
    };

    const handleCreateClass = () => {

        if (newClassInfo.name == "" || newClassInfo.description == "") {
            setIsError(true);
            setCreateClassMsg("Please fill in all the fields!");

            if (intervalId) {
                clearInterval(intervalId);
            }
            const newIntervalId = setInterval(() => {
                setCreateClassMsg('');
                setIsError(false);
            }, 3000);
            setIntervalId(newIntervalId);
            return;
        }

        createClass(newClassInfo)
            .then(i => {
                console.log(i);
                const input = i.created;
                const date = new Date(input);
                const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const newClass = { ...i, created: formattedDate }
                setIsCreateBtnClicked(false);
                setNewClassInfo({ name: "", description: "" });
                setClasses(prev => [newClass, ...prev]);
                updateClasses([newClass, ...classes]);
                setCreateClassMsg("Successfully created class!");

                if (intervalId) {
                    clearInterval(intervalId);
                }
                const newIntervalId = setInterval(() => {
                    setCreateClassMsg('');
                }, 3000);
                setIntervalId(newIntervalId);

            })
            .catch(e => {
                console.log(e);
                setIsError(true);
                setCreateClassMsg(e);

                if (intervalId) {
                    clearInterval(intervalId);
                }
                const newIntervalId = setInterval(() => {
                    setCreateClassMsg('');
                    setIsError(false);
                }, 3000);
                setIntervalId(newIntervalId);

            })
    }

    const cancleCreateClass = () => {
        setIsCreateBtnClicked(false);
        setNewClassInfo({ name: "", description: "" });
    }
    //////////////////////////////////////////////////////////////


    const handleSaveEditClass = async (editClassInfo) => {
        const { classId, name, description } = editClassInfo;
        await editClass({ classId, name, description })
            .then((i) => {
                console.log(i);
                //For classOverview page
                setClasses(classes.map((item) => {
                    if (item.classId === classId) {
                        return editClassInfo;
                    }
                    return item;
                }));

                //For navbar and general page
                updateClasses(classes.map((item) => {
                    if (item.classId === classId) {
                        return editClassInfo;
                    }
                    return item;
                }));
            })
    }




    const handledeleteClass = async (classId) => {
        await deleteClass(classId)
            .then((i) => {
                console.log(i);
                setClasses(classes.filter((item) => item.classId !== classId));
            })
    }




    /////////////////////////////////////////////////////////
    const [search, setSearch] = useState('');

    // const [prefixCounts, setPrefixCounts] = useState([]);

    // useEffect(() => {
    //     const namePrefixes = items.reduce((acc, item) => {
    //         const prefix = item.name.substring(0, 4);
    //         acc[prefix] = (acc[prefix] || 0) + 1;
    //         return acc;
    //     }, {});

    //     const prefixCountArray = Object.entries(namePrefixes).map(([prefix, count]) => ({ prefix, count }));

    //     setPrefixCounts(prefixCountArray);
    // }, []);




    return (

        // Commented out everything below

        <ContentBox id={'classOverview'}>
            <MainContent styles="gap-8">
                <ContentHeader
                    title="Class Overview"
                    subtitle="How are your classes doing?"
                    icons={[
                        { id: 1, tag: <HelpIcon /> },
                    ]}
                    children={(
                        <div
                            className="flex justify-center items-center gap-[10px]"
                            onClick={openClassTemplate}
                        >
                            <div
                                className='h-full aspect-square flex items-center justify-center w-6'>
                                <PlusIcon />
                            </div>
                            <p id='createClassBtn' className="whitespace-nowrap">Create Class</p>
                        </div>
                    )}
                />

                <section className="flex flex-col gap-[30px]">
                    {createClassMsg !== "" &&
                        <p className={`${isError ? "text-bgRed1" : "text-bgGreen1"}`}>
                            {`${createClassMsg}`}
                        </p>
                    }
                    {isCreateBtnClicked && (
                        <CreateClassCard newClassInfo={newClassInfo} setNewClassInfo={setNewClassInfo} createClass={handleCreateClass} cancleCreateClass={cancleCreateClass} />
                    )}
                </section>

                <section className="flex flex-col gap-[30px]">
                    {classes && classes.map(item =>
                        <ClassCard key={item.classId} item={item} handleDeleteClass={handledeleteClass} handleSaveEditClass={handleSaveEditClass} />
                    )}
                </section>

            </MainContent>

            <Sidebar styles="gap-[40px]">
                <section className="rounded-[20px] bg-white1 p-[30px] flex flex-col gap-5 shadow-md">
                    <h1 className="text-[28px] font-semibold">{`Details`}</h1>
                    {/* <Searchbar title="Search" placeholder="What are you looking for?" onSearchChange={setSearch} search={search} /> */}
                    <div className="rounded-[10px] border border-white3 p-5">
                        <div className="flex justify-between items-center">
                            <h2 className="pb-3 text-black2 text-sm">
                                {`Total Classes`}
                            </h2>
                            <Bookmark />
                        </div>
                        <p className="text-[32px] font-semibold">{`${classes.length}`}</p>
                    </div>
                </section>

                {/* <section>
                    <h1 className="text-[28px] font-semibold mb-[30px]">Topics</h1>
                    <div className="flex flex-col gap-2 ">
                        {prefixCounts && prefixCounts.map((item) => (
                        <div 
                        id={`${item.prefix}`} key={item.prefix}
                        className="flex gap-2 justify-between items-center bg-white shadow-standard p-base border border-white3 rounded-[10px]"
                        >
                            <h1 className="text-xl">
                            {item.prefix}
                            </h1>
                            <div className={`font-semibold text-base text-bgGreen1 bg-bgGreen3 p-2 rounded-[5px]`}>
                            {item.count}
                            </div>
                        </div>
                        ))}

                    </div>
                </section> */}

            </Sidebar>
        </ContentBox>

    )
}

export default ClassOverview;