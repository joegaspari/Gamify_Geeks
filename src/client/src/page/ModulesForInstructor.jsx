import React, { useEffect, useState, useCallback, useInsertionEffect } from 'react';
import { List, arrayMove } from 'react-movable';
import { Accordion } from 'react-accessible-accordion';
import SelectBox from '../components/InputBox/Select/SelectBox';
import { useData } from '../context/DataContext';
import ContentHeader from '../components/ContentHeader';
import Module from '../components/Module';
import HelpIcon from '../components/icon/HelpIcon';
import PlusIcon from '../components/icon/Plus/PlusIcon';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ContentBox from './ContentBox';
import TextInput from '../components/InputBox/Input/TextInput';
import DateInput from '../components/InputBox/Input/DateSelectInput';
import { useProfile } from '../context/ProfileContext';
import { useLoading } from '../hook/useLoading';
import EyesIcon from '../components/icon/EyesIcon';
import ClosedEyeIcon from '../components/icon/ClosedEyeIcon';
import LargePencil from '../components/icon/pencil/LargePencil';
import Save from '../components/icon/Save';
import TrashCan from '../components/icon/TrashCan';
import IsoLoading from '../components/IsoLoading';
import Loading from '../components/Loading';
import BoldMinus from '../components/icon/minus/BoldMinus';
import BoldPlus from '../components/icon/Plus/BoldPlus';
import LockedSelectBox from '../components/InputBox/Select/LockSelectBox';

const newModelTemplate = {
  assignments: [],
  id: "",
  status: 1,
  title: "New Module",
  visible: 1
}

const newAssignmentTemplate = {
  id: "",
  name: "",
  numberOfQuestions: "",
  topic: "",
  topicId: "",
  difficulty: "",
  diffId: "",
  language: "",
  langId: "",
  status: 1,
  deadline: "",
  visible: 1,
  sampleQuestion: ""
};


export default function ModulesForInstructor(props) {

  //API
  const {
    getLanguages, getDifficulties, getInstructorModules, getTopicCategory, getNumberOfQuestions,
    getPracticeItems, deleteModule, changeModuleVisibility, createModule, changeAssignmentVisibility,
    deleteAssignment, createAssignment, editAssignment
  } = useData();

  //for classId
  const { mainCourse } = useProfile();
  /////////////////////////////////////////////////////////////////////////////



  //Get modules data
  const [modulesData, setModulesData] = useState(null);
  useEffect(() => {

    mainCourse && getInstructorModules(mainCourse.classId)
      .then((i) => {
        setModulesData(i);
      });
  }, [
    getInstructorModules,
    mainCourse
  ]);
  /////////////////////////////////////////////////////////////////////////////

  const [isModuleAddBtnClicked, setIsModuleAddBtnClicked] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const { isLoading: isAddNewModuleLoading, startLoading: startNewModuleLoading, stopLoading: stopNewModuleLoading } = useLoading({});
  const [isAddNewModuleError, setIsAddNewModuleError] = useState(false);
  const [addNewModuleMsg, setAddNewModuleMsg] = useState('');
  const [intervalIdForAddModule, setIntervalIdForAddModule] = useState(null);


  const { isLoading: isEditModuleLoading, startLoading: startEditModuleLoading, stopLoading: stopEditModuleLoading } = useLoading({});
  const [isEditModuleError, setIsEditModuleError] = useState(false);
  const [editModuleMsg, setEditModuleMsg] = useState('');
  const [intervalIdForEditModule, setIntervalIdForEditModule] = useState(null);

  const [isEditModuleBtnClicked, setIsEditModuleBtnClicked] = useState(false);
  const [updatedModuleTitle, setUpdatedModuleTitle] = useState('');
  const [initialModuleTitle, setInitialModuleTitle] = useState('');
  const [selectedId, setSelectedId] = useState({ moduleId: null, assignmentId: null });

  const [isOpenAssignDetails, setIsOpenAssignDetails] = useState(false);

  const [topicCategories, setTopicCategories] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [numbersOfQuestions, setNumbersOfQuestions] = useState(null);
  const [difficulties, setDifficulties] = useState(null);

  const [prevAssignment, setPrevAssignment] = useState({ value: null, moduleId: null, assignmentId: null });

  const [updatedAssignName, setUpdatedAssignName] = useState('');
  const [updatedAssignNumOfQ, setUpdatedAssignNumOfQ] = useState(0);
  const [updatedAssignTopicId, setUpdatedAssignTopicId] = useState(0);
  const [updatedAssignLangId, setUpdatedAssignLangId] = useState(0);
  const [updatedAssignDiffId, setUpdatedAssignDiffId] = useState(0);
  const [updatedAssignDeadline, setUpdatedAssignDeadline] = useState(0);
  const [sampleQuestion, setSampleQuestion] = useState('');

  const { isLoading: isEditAssignmentLoading, startLoading: startEditAssignmentLoading, stopLoading: stopEditAssignmentLoading } = useLoading({});
  const [isEditAssignmentError, setIsEditAssignmentError] = useState(false);
  const [editAssignmentMsg, setEditAssignmentMsg] = useState('');
  const [intervalIdForEditAssignment, setIntervalIdForEditAssignment] = useState(null);



  //For add new module
  const handleAddMoudleBtn = () => {
    if (isModuleAddBtnClicked) {
      alert('A new module template is already open!');
      return;
    }
    !isModuleAddBtnClicked && setIsModuleAddBtnClicked(true);
    isAddNewModuleError && setIsAddNewModuleError(false);
    addNewModuleMsg && setAddNewModuleMsg('');

    //when open a new module template, close edit module template and reset if it is open
    setIsEditModuleBtnClicked(false);
    setIsEditModuleError(false);
    setEditModuleMsg('');
    setUpdatedModuleTitle('');
    setIsOpenAssignDetails(false);
    setSelectedId({ moduleId: null, assignmentId: null });

  }



  const handleNewModuleTitleChange = (e) => {
    setNewModuleTitle(e.target.value);
  }


  const addNewModule = (newModuleTitle) => {

    if (isAddNewModuleLoading) {
      return;
    }

    if (!newModuleTitle) {
      alert('Please enter a title for the new module!');
      return;
    }

    startNewModuleLoading();
    createModule({ name: newModuleTitle, classId: mainCourse.classId })
      .then((i) => {
        setModulesData([{ ...newModelTemplate, title: newModuleTitle, id: i.moduleId }, ...modulesData]);
        setIsModuleAddBtnClicked(false);
        setNewModuleTitle('');
        setAddNewModuleMsg('New module added successfully!');
        if (intervalIdForAddModule) {
          clearInterval(intervalIdForAddModule);
        }
        const newIntervalId = setInterval(() => {
          setIsAddNewModuleError(false);
          setAddNewModuleMsg('');
        }, 3000);
        setIntervalIdForAddModule(newIntervalId);
      })
      .catch((e) => {
        console.log(e);
        setIsAddNewModuleError(true);
        setAddNewModuleMsg('Failed to add new module!');
        if (intervalIdForAddModule) {
          clearInterval(intervalIdForAddModule);
        }
        const newIntervalId = setInterval(() => {
          setIsAddNewModuleError(false);
          setAddNewModuleMsg('');
        }, 3000);
        setIntervalIdForAddModule(newIntervalId);
      })
      .finally(() => {
        stopNewModuleLoading();
      })

  }

  const cancleAddNewModule = () => {
    setIsModuleAddBtnClicked(false);
    setNewModuleTitle('');
  }


  //when add new module template is closed before save, reset the add new module template
  useEffect(() => {
    if (!isModuleAddBtnClicked) {
      setNewModuleTitle('');
      setIsAddNewModuleError(false);
      setAddNewModuleMsg('');
    }

  }, [isModuleAddBtnClicked])


  /////////////////////////////////////////////////////////////////////////////





  //For module visibility
  const handleToggleModuleVisiblity = (moduleId) => {
    changeModuleVisibility({ moduleId, classId: mainCourse.classId })
      .then((i) => {
        console.log(i);
        const newModulesData = modulesData.map((module) => {
          if (module.id == moduleId) {
            return { ...module, visible: module.visible === 1 ? 0 : 1 };
          }
          return module;
        });
        setModulesData(newModulesData);
      })
      .catch((e) => {
        console.error(e);
      })
  }

  /////////////////////////////////////////////////////////////////////////////





  //For edit module


  //When clicked the edit btn
  const handleClickEditModuleBtn = (moduleId) => {

    setSelectedId({ moduleId, assignmentId: null });
    setIsOpenAssignDetails(false);


    //when cliked the edit btn, close the add new module template and reset if it is open
    setIsModuleAddBtnClicked(false);

    //When clicked the edit btn, need to reset the error msg
    setIsEditModuleError(false);
    setEditModuleMsg('');



    //When clicked module's edit btn, need to open the edit input
    setIsEditModuleBtnClicked(true);

    //Remember the selected module id
    setSelectedId({ moduleId, assignmentId: null });

    //initiate the edit input with the module title
    setUpdatedModuleTitle(modulesData.find((module) => module.id == moduleId).title);
  }



  const handlChangeUpdatedModuleTitle = (value) => {
    // module title for the edit input
    setUpdatedModuleTitle(value);

    // module title for the actual module
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId) {
        return { ...module, title: value };
      }
      return module;
    }
    ));
  }

  //for edit module
  const handleUpdateModule = () => {
    if (!updatedModuleTitle) {
      alert('Nothing to update!');
      return;
    }
  }

  //For delete module
  const handleDeleteModule = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this module?');
    if (!isConfirmed) {
      return;
    }

    startEditModuleLoading();
    deleteModule({ moduleId: selectedId.moduleId, classId: mainCourse.classId })
      .then((i) => {
        console.log(i);
        setModulesData(modulesData.filter((module) => module.id != selectedId.moduleId));
        setSelectedId({ moduleId: null, assignmentId: null });
        setIsEditModuleBtnClicked(false);
        setInitialModuleTitle('');


        setEditModuleMsg('Module deleted successfully!');
        if (intervalIdForEditModule) {
          clearInterval(intervalIdForEditModule);
        }
        const newIntervalId = setInterval(() => {
          setEditModuleMsg('');
        }, 3000);
        setIntervalIdForEditModule(newIntervalId);
      })
      .catch((e) => {
        console.error(e);

        setEditModuleMsg('Failed to delete module!');
        setIsEditModuleError(true);
        if (intervalIdForEditModule) {
          clearInterval(intervalIdForEditModule);
        }
        const newIntervalId = setInterval(() => {
          setIsEditModuleError(false);
          setEditModuleMsg('');
        }, 3000);
        setIntervalIdForEditModule(newIntervalId);
      })
      .finally(() => {
        stopEditModuleLoading();
      });
  }





  //For add assignment
  const handleAddAssignment = (moduleId) => {

    //when open a new module template, close edit module template and reset if it is open
    isEditModuleBtnClicked && setIsEditModuleBtnClicked(false);
    isEditModuleError && setIsEditModuleError(false);
    editModuleMsg && setEditModuleMsg('');
    updatedModuleTitle && setUpdatedModuleTitle('');
    setSelectedId({ moduleId: null, assignmentId: null });

    //When clicked the add assignment btn, need to reset previous one module title and add new assignment template
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId && module.id == moduleId) {
        const newId = module.assignments.length;
        return {
          ...module,
          title: initialModuleTitle,
          assignments: [{ ...newAssignmentTemplate, id: `index:${newId.toString()}` }, ...module.assignments]
        };
      }
      else if (module.id == selectedId.moduleId) {
        return { ...module, title: initialModuleTitle };
      }
      else if (module.id == moduleId) {
        const newId = module.assignments.length;
        return {
          ...module,
          assignments: [{ ...newAssignmentTemplate, id: `index:${newId.toString()}` }, ...module.assignments]
        };
      }
      return module;
    }));
  }






  useEffect(() => {
    getPracticeItems({ search: "", pageLength: 10000, page: 1, multiOptions: { languages: [] } })
      .then((i) => {
        console.log(i.topicCards);
        setTopicCategories(i.topicCards);
      })
      .catch((e) => {
        console.error(e);
      });


    //Difficulties and number of questions are not related to topic for now but later need to change to be depends on topic  
    getDifficulties()
      .then((i) => {
        console.log(i);
        setDifficulties(i);
      })
      .catch((e) => {
        console.error(e);
      });

    getNumberOfQuestions()
      .then((i) => {
        console.log(i);
        setNumbersOfQuestions(i);
      })
      .catch((e) => {
        console.error(e);
      });



  }, [getTopicCategory])


  const [limitedUpdate, setLimitedUpdate] = useState(false);

  const handleSelectAssignment = (moduleId, assignmentId) => {
    setIsModuleAddBtnClicked(false);
    setIsOpenAssignDetails(true);
    setIsEditModuleBtnClicked(false);
    setSelectedId({ moduleId, assignmentId });

    (typeof assignmentId === 'string' && assignmentId.includes('index')) ? setLimitedUpdate(false) : setLimitedUpdate(true);


    //Languages depends on topic
    const moduleMatch = modulesData.find((module) => module.id == moduleId);
    const assignmentMatch = moduleMatch ? moduleMatch.assignments.find((assignment) => assignment.id == assignmentId) : null;
    const thisAssignTopicId = assignmentMatch && assignmentMatch.topicId ? assignmentMatch.topicId : topicCategories[0].id;

    setLanguages(topicCategories.find((topic) => topic.id == thisAssignTopicId).languages);

  }


  const handleChangeTopicId = (topicId) => {
    setUpdatedAssignTopicId(topicId);
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId) {
        return {
          ...module,
          assignments: module.assignments.map((assignment) => {
            if (assignment.id == selectedId.assignmentId) {
              const topic = topicCategories.find((topic) => topic.id == topicId).title;
              return { ...assignment, topicId, topic };
            }
            return assignment;
          })
        };
      }
      return module;
    }
    ));
  }

  const handleChangeNumOfQId = (numOfQId) => {
    setUpdatedAssignNumOfQ(numOfQId);
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId) {
        return {
          ...module,
          assignments: module.assignments.map((assignment) => {
            if (assignment.id == selectedId.assignmentId) {
              return { ...assignment, numberOfQuestions: numOfQId };
            }
            return assignment;
          })
        };
      }
      return module;
    }
    ));
  }



  const handleChangeLangId = (langId) => {
    setUpdatedAssignLangId(langId);
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId) {
        return {
          ...module,
          assignments: module.assignments.map((assignment) => {
            if (assignment.id == selectedId.assignmentId) {
              const language = languages.find((language) => language.id == langId).name;
              return { ...assignment, langId, language };
            }
            return assignment;
          })
        };
      }
      return module;
    }
    ));
  }

  const handleChangeDiffId = (diffId) => {
    setUpdatedAssignDiffId(diffId);
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId) {
        return {
          ...module,
          assignments: module.assignments.map((assignment) => {
            if (assignment.id == selectedId.assignmentId) {
              const difficulty = difficulties.find((difficulty) => difficulty.id == diffId).name;
              return { ...assignment, diffId, difficulty };
            }
            return assignment;
          })
        };
      }
      return module;
    }
    ));
  }

  const handleChangeDeadline = (deadline) => {
    setUpdatedAssignDeadline(deadline);
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId) {
        return {
          ...module,
          assignments: module.assignments.map((assignment) => {
            if (assignment.id == selectedId.assignmentId) {
              return { ...assignment, deadline };
            }
            return assignment;
          })
        };
      }
      return module;
    }
    ));
  }









  //reset the edit module template when cancel
  useEffect(() => {

    if (!modulesData || modulesData.length == 0) return;


    if (selectedId.moduleId !== prevAssignment.moduleId || selectedId.assignmentId !== prevAssignment.assignmentId) {

      setModulesData(modulesData.map((module) => {
        if (module.id == prevAssignment.moduleId) {
          return {
            ...module,
            title: initialModuleTitle,
            assignments: module.assignments.map((assignment) => {
              if (assignment.id == prevAssignment.assignmentId) {
                return {
                  ...prevAssignment.value
                };
              }
              return assignment;
            })
          };
        }
        return module;
      }))

      //find selected assignment and initiate the edit input with the assignment data in the side bar
      const selectedModule = modulesData.find((module) => module.id == selectedId.moduleId);
      const selectedAssignment = selectedModule && selectedModule.assignments.find((assignment) => assignment.id == selectedId.assignmentId);

      console.log(selectedAssignment);
      console.log(prevAssignment.value);

      if (selectedAssignment) {
        const { name, numberOfQuestions, topicId, langId, diffId, deadline, sampleQuestion } = selectedAssignment;

        setUpdatedAssignName(name);
        setUpdatedAssignNumOfQ(numberOfQuestions);
        setUpdatedAssignTopicId(topicId);
        setUpdatedAssignLangId(langId);
        setUpdatedAssignDiffId(diffId);
        setUpdatedAssignDeadline(deadline);
        setSampleQuestion(sampleQuestion);
      }

      //Remember the initial module title for reset when cancel
      selectedId.moduleId && setInitialModuleTitle(modulesData.find((module) => module.id == selectedId.moduleId).title);

      setPrevAssignment({
        value: selectedAssignment,
        moduleId: selectedId.moduleId,
        assignmentId: selectedId.assignmentId
      });

    }

  }, [selectedId, topicCategories, difficulties]);

  const handlChangeUpdatedAssignName = (value) => {
    // assignment name for the edit input
    setUpdatedAssignName(value);

    // assignment name for the actual assignment
    setModulesData(modulesData.map((module) => {
      if (module.id == selectedId.moduleId) {
        return {
          ...module,
          assignments: module.assignments.map((assignment) => {
            if (assignment.id == selectedId.assignmentId) {
              return { ...assignment, name: value };
            }
            return assignment;
          })
        };
      }
      return module;
    }
    ));

  }





  const handleUpdateAssignment = () => {

    console.log(prevAssignment);
    if (!updatedAssignName || !updatedAssignNumOfQ || !updatedAssignTopicId || !updatedAssignLangId || !updatedAssignDiffId || !updatedAssignDeadline) {
      alert('Need to fill all the fields!');
      return;
    }
    else if (updatedAssignName == prevAssignment.value.name && updatedAssignNumOfQ == prevAssignment.value.numberOfQuestions && updatedAssignTopicId == prevAssignment.value.topicId && updatedAssignLangId == prevAssignment.value.langId && updatedAssignDiffId == prevAssignment.value.diffId && updatedAssignDeadline == prevAssignment.value.deadline) {
      alert('Nothing to update!');
      return;
    }

    startEditAssignmentLoading();


    typeof selectedId.assignmentId === 'string' && selectedId.assignmentId.includes('index') ?
      createAssignment({
        moduleId: selectedId.moduleId,
        name: updatedAssignName,
        numberOfQuestions: updatedAssignNumOfQ,
        topicId: updatedAssignTopicId,
        langId: updatedAssignLangId,
        diffId: updatedAssignDiffId,
        deadline: updatedAssignDeadline,
      })
        .then((i) => {
          console.log(i);
          setModulesData(modulesData.map((module) => {
            if (module.id == selectedId.moduleId) {
              return {
                ...module,
                assignments: module.assignments.map((assignment) => {
                  if (assignment.id == selectedId.assignmentId) {
                    return {
                      ...assignment,
                      id: i.id,
                      name: updatedAssignName,
                      numberOfQuestions: updatedAssignNumOfQ,
                      topicId: updatedAssignTopicId,
                      langId: updatedAssignLangId,
                      diffId: updatedAssignDiffId,
                      deadline: updatedAssignDeadline,
                      sampleQuestion: i.sampleQuestion
                    };
                  }
                  return assignment;
                })
              };
            }
            return module;
          }
          ));

          const selectedModule = modulesData.find((module) => module.id == selectedId.moduleId);
          const selectedAssignment = selectedModule && selectedModule.assignments.find((assignment) => assignment.id == selectedId.assignmentId);
          setPrevAssignment({
            value: selectedAssignment,
            moduleId: selectedId.moduleId,
            assignmentId: selectedId.assignmentId
          });
          setSampleQuestion(i.sampleQuestion);

          setEditAssignmentMsg('Assignment Added successfully!');
          if (intervalIdForEditAssignment) {
            clearInterval(intervalIdForEditAssignment);
          }
          const newIntervalId = setInterval(() => {
            setEditAssignmentMsg('');
          }
            , 3000);
          setIntervalIdForEditAssignment(newIntervalId);
        })
        .catch((e) => {
          console.error(e);

          setEditAssignmentMsg('Failed to Add assignment!');
          setIsEditAssignmentError(true);
          if (intervalIdForEditAssignment) {
            clearInterval(intervalIdForEditAssignment);
          }
          const newIntervalId = setInterval(() => {
            setIsEditAssignmentError(false);
            setEditAssignmentMsg('');
          }, 3000);
          setIntervalIdForEditAssignment(newIntervalId);
        })
        .finally(() => {
          stopEditAssignmentLoading();
        })
      :
      editAssignment({
        assignmentId: selectedId.assignmentId,
        name: updatedAssignName,
        deadline: updatedAssignDeadline,
      })
        .then((i) => {
          console.log(i);
          setModulesData(modulesData.map((module) => {
            if (module.id == selectedId.moduleId) {
              return {
                ...module,
                assignments: module.assignments.map((assignment) => {
                  if (assignment.id == selectedId.assignmentId) {
                    return {
                      ...assignment,
                      name: updatedAssignName,
                      deadline: updatedAssignDeadline,
                    };
                  }
                  return assignment;
                })
              };
            }
            return module;
          }
          ));

          const selectedModule = modulesData.find((module) => module.id == selectedId.moduleId);
          const selectedAssignment = selectedModule && selectedModule.assignments.find((assignment) => assignment.id == selectedId.assignmentId);
          setPrevAssignment({
            value: selectedAssignment,
            moduleId: selectedId.moduleId,
            assignmentId: selectedId.assignmentId
          });
          // setSampleQuestion(i.sampleQuestion);

          setEditAssignmentMsg('Assignment updated successfully!');
          if (intervalIdForEditAssignment) {
            clearInterval(intervalIdForEditAssignment);
          }
          const newIntervalId = setInterval(() => {
            setEditAssignmentMsg('');
          }
            , 3000);
          setIntervalIdForEditAssignment(newIntervalId);
        })
        .catch((e) => {
          console.error(e);

          setEditAssignmentMsg('Failed to update assignment!');
          setIsEditAssignmentError(true);
          if (intervalIdForEditAssignment) {
            clearInterval(intervalIdForEditAssignment);
          }
          const newIntervalId = setInterval(() => {
            setIsEditAssignmentError(false);
            setEditAssignmentMsg('');
          }, 3000);
          setIntervalIdForEditAssignment(newIntervalId);
        })
        .finally(() => {
          stopEditAssignmentLoading();
        });

  }

  const handleDeleteAssignment = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this assignment?');
    if (!isConfirmed) {
      return;
    }

    startEditModuleLoading();
    deleteAssignment({ moduleId: selectedId.moduleId, assignmentId: selectedId.assignmentId, classId: mainCourse.classId })
      .then((i) => {
        console.log(i);
        setModulesData(modulesData.map((module) => {
          if (module.id == selectedId.moduleId) {
            return {
              ...module,
              assignments: module.assignments.filter((assignment) => assignment.id != selectedId.assignmentId)
            };
          }
          return module;
        }));
        setSelectedId({ moduleId: null, assignmentId: null });
        setIsOpenAssignDetails(false);

        setEditAssignmentMsg('Assignment deleted successfully!');
        if (intervalIdForEditAssignment) {
          clearInterval(intervalIdForEditAssignment);
        }
        const newIntervalId = setInterval(() => {
          setEditAssignmentMsg('');
        }, 3000);
        setIntervalIdForEditAssignment(newIntervalId);
      })
      .catch((e) => {
        console.error(e);

        setEditAssignmentMsg('Failed to delete assignment!');
        setIsEditAssignmentError(true);
        if (intervalIdForEditAssignment) {
          clearInterval(intervalIdForEditAssignment);
        }
        const newIntervalId = setInterval(() => {
          setIsEditAssignmentError(false);
          setEditAssignmentMsg('');
        }, 3000);
        setIntervalIdForEditAssignment(newIntervalId);
      })
      .finally(() => {
        stopEditAssignmentLoading();
      });
  }



  const handleToggleAssignmentVisiblity = (moduleId, assignmentId) => {
    changeAssignmentVisibility({ moduleId, assignmentId, classId: mainCourse.classId })
      .then((i) => {
        console.log(i);
        const newModulesData = modulesData.map((module) => {
          if (module.id == moduleId) {
            return {
              ...module,
              assignments: module.assignments.map((assignment) => {
                if (assignment.id == assignmentId) {
                  return { ...assignment, visible: assignment.visible === 1 ? 0 : 1 };
                }
                return assignment;
              })
            };
          }
          return module;
        });
        setModulesData(newModulesData);
      })
      .catch((e) => {
        console.error(e);
      })
  }


  const [isSampleQuestionOpen, setIsSampleQuestionOpen] = useState(true);
  const handleToggleSampleQuestion = () => {
    setIsSampleQuestionOpen(prev => !prev);
  }


  useEffect(() => {
    updatedAssignTopicId && topicCategories && setLanguages(topicCategories.find((topic) => topic.id == updatedAssignTopicId).languages);
  }, [updatedAssignTopicId])










  return (
    <ContentBox id={'modules'}>
      <MainContent styles="gap-8">
        <ContentHeader
          title="Manage Modules"
          subtitle="Set student assignments!"
          icons={[
            { id: 1, tag: <HelpIcon /> },
          ]}
          children={(
            <div
              className="flex gap-5"
              onClick={() => { handleAddMoudleBtn() }}>
              <div className='h-full aspect-square flex items-center justify-center w-6'>
                <PlusIcon />
              </div>
              <p id='addModuleBtn' className="whitespace-nowrap">Add New Module</p>
            </div>
          )}
        />

        {/* Create New Module Card */}
        <section>

          {
            <CreateModuleCard
              isModuleAddBtnClicked={isModuleAddBtnClicked}
              newModuleTitle={newModuleTitle}
              handleNewModuleTitleChange={handleNewModuleTitleChange}
              addNewModule={addNewModule}
              cancleAddNewModule={cancleAddNewModule}
              isAddNewModuleLoading={isAddNewModuleLoading}
              isAddNewModuleError={isAddNewModuleError}
              addNewModuleMsg={addNewModuleMsg}
            />
          }
        </section>

        <section>
          <Accordion allowMultipleExpanded allowZeroExpanded >
            {modulesData && modulesData.map((data, index) => {
              return (
                <Module
                  key={data.id}
                  moduleData={data}
                  moduleIndex={index}
                  handleToggleModuleVisiblity={handleToggleModuleVisiblity}
                  handleClickEditModuleBtn={handleClickEditModuleBtn}
                  handleAddAssignment={handleAddAssignment}
                  setModulesData={setModulesData}
                  handleToggleAssignmentVisiblity={handleToggleAssignmentVisiblity}
                  handleSelectAssignment={handleSelectAssignment}
                  selectedId={selectedId}
                  // when isEditLoading, other button shouldn't be clicked. Most of them work in that way by z-index but buttons on mondule doesn't work so manually sending isEditLoading foe now
                  isEditLoading={isEditAssignmentLoading}
                />
              )

            })}
          </Accordion>
        </section>


      </MainContent>

      <Sidebar>
        <section>
          <div id='details-container' className="bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-sm">
            <h1 className="text-2xl font-semibold">Details</h1>
            {
              !isEditModuleBtnClicked && !isOpenAssignDetails &&
              <p id="default-text">Please select any of your assignments to view & edit the details!</p>
            }
            {
              isEditModuleBtnClicked && !isOpenAssignDetails && (
                <>
                  Module
                  <TextInput
                    title="Name"
                    textValue={updatedModuleTitle}
                    setTextValue={handlChangeUpdatedModuleTitle}
                    placeholder={"Update a Module Name?"}

                    // don't have edit module api for now
                    disabled={true}

                  />
                </>
              )
            }
            {
              isOpenAssignDetails && !isEditModuleBtnClicked && (
                <>
                  Assigment
                  <TextInput
                    title="Name"
                    textValue={updatedAssignName}
                    setTextValue={handlChangeUpdatedAssignName}
                    placeholder={"Update a Module Name?"}
                  />
                  {limitedUpdate ? (
                    <>
                      <LockedSelectBox options={numbersOfQuestions} title="Number Of Questions" initialOption={updatedAssignNumOfQ} />
                      <LockedSelectBox options={topicCategories} title="Topic" initialOption={updatedAssignTopicId} />
                      <LockedSelectBox options={languages} title="Language" initialOption={updatedAssignLangId} />
                      <LockedSelectBox options={difficulties} title="Difficulty" initialOption={updatedAssignDiffId} />
                    </>
                  ) : (
                    <>
                      <SelectBox options={numbersOfQuestions} title="Number Of Questions" handleOption={handleChangeNumOfQId} initialOption={updatedAssignNumOfQ} />
                      <SelectBox options={topicCategories} title="Topic" handleOption={handleChangeTopicId} initialOption={updatedAssignTopicId} />
                      <SelectBox options={languages} title="Language" handleOption={handleChangeLangId} initialOption={updatedAssignLangId} />
                      <SelectBox options={difficulties} title="Difficulty" handleOption={handleChangeDiffId} initialOption={updatedAssignDiffId} />
                    </>
                  )}
                  <DateInput title="Deadline" setDateValue={handleChangeDeadline} initialDate={updatedAssignDeadline} />

                </>
              )
            }
          </div>
        </section>

        <section>

          <ModulePageUpdateButton
            isEditBtnClicked={isEditModuleBtnClicked}
            handleUpdate={handleUpdateModule}
            handleDelete={handleDeleteModule}
            isEditLoading={isEditModuleLoading}
            isEditError={isEditModuleError}
            editMsg={editModuleMsg}
          />
          <ModulePageUpdateButton
            isEditBtnClicked={isOpenAssignDetails}
            handleUpdate={handleUpdateAssignment}
            handleDelete={handleDeleteAssignment}
            isEditLoading={isEditAssignmentLoading}
            isEditError={isEditAssignmentError}
            editMsg={editAssignmentMsg}
            sampleQuestion={sampleQuestion}
            isSampleQuestionOpen={isSampleQuestionOpen}
            handleToggleSampleQuestion={handleToggleSampleQuestion}

          />




        </section>

      </Sidebar>
    </ContentBox >
  );
}


function CreateModuleCard({
  isModuleAddBtnClicked, newModuleTitle, handleNewModuleTitleChange, addNewModule, cancleAddNewModule,
  isAddNewModuleLoading, isAddNewModuleError, addNewModuleMsg
}) {

  return (
    <>
      {
        addNewModuleMsg && (
          <p className={`
        p-5
        ${isAddNewModuleError ? 'text-red-500' : 'text-green-500'}
        `}>
            {addNewModuleMsg}
          </p>
        )
      }
      {
        isModuleAddBtnClicked && (
          <div className={`
      p-base bg-white1 rounded-[20px] shadow-standard
      `}>
            <div className="flex m-0 justify-between relative gap=5">
              <div className="flex w-fit gap-5">
                {
                  isAddNewModuleLoading && (
                    <div className="z-[100] bg-white fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
                      <Loading />
                    </div>
                  )
                }
                {
                  !isAddNewModuleLoading && (
                    <>
                      <div className="flex flex-col gap-[10px]">
                        <label htmlFor="create-module-name">
                          {"Module Name"}
                        </label>
                        <input
                          name="create-module-name"
                          type="text"
                          className={`
                    p-sm text-xl
                    rounded-md
                    border border-black2
                    `}
                          value={newModuleTitle}
                          onChange={handleNewModuleTitleChange}
                          placeholder='Add a Module Name'
                        />
                      </div>
                    </>
                  )
                }
              </div>
              <div className="flex gap-5 items-center  relative z-50">
                <button id='moduleVisibility' onClick={() => { addNewModule(newModuleTitle) }}
                  className={`
            h-7 w-7
            hover:scale-105 hover:bg-bgBlue2
            transition-all ease-in duration-200
            flex items-center
            cursor-pointer  
            rounded-full
            `}
                >
                  <Save />
                </button>
                <button id='moduleVisibility' onClick={() => { cancleAddNewModule() }}
                  className={`
            h-7 w-7
            hover:scale-105 hover:bg-bgBlue2
            transition-all ease-in duration-200
            flex items-center
            cursor-pointer  
            rounded-full
            `}
                >
                  <TrashCan />
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}


function ModulePageUpdateButton({
  isEditBtnClicked, handleUpdate, handleDelete, isEditLoading, isEditError, editMsg, sampleQuestion = '', isSampleQuestionOpen, handleToggleSampleQuestion
}) {

  return (
    <div className="flex flex-col gap-5">
      {
        isEditBtnClicked && (
          <>
            {
              sampleQuestion && (
                <div className={`bg-white1 rounded-[20px] shadow-standard p-base flex flex-col gap-sm`}>
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold">Sample</h1>
                    <div
                      className={`
                    flex justify-between items-center
                    hover:bg-bgBlue2 ease-in duration-200 transition-all
                    hover:scale-105
                    rounded-full cursor-pointer
                    h-full aspect-square
                    `}
                      onClick={handleToggleSampleQuestion}>
                      {isSampleQuestionOpen ? <BoldMinus /> : <BoldPlus />}
                    </div>
                  </div>
                  {
                    isSampleQuestionOpen && (
                      <div className="text-lg leading-7	text-black1 flex flex-col gap-4">
                        <p>{`${sampleQuestion}`}</p>
                      </div>
                    )
                  }
                </div>
              )
            }
            {
              isEditLoading && (
                <Loading />
              )
            }
          </>
        )
      }
      {
        isEditBtnClicked && (
          <div className={`
                mt-3 flex gap-5 justify-between items-center 
                text-white1 text-lg font-semibold
                `}>
            <button id='deleteBtn'
              onClick={() => { handleDelete() }}
              className={`
                    w-1/2
                    px-3 py-1 rounded-lg 
                    ease-out duration-200 
                    cursor-pointer bg-bgRed1
                    active:bg-red-700
                    ${isEditLoading ? "opacity-50 hover:scale-100 cursor-not-allowed" : "hover:scale-110"}
                    `}
              disabled={isEditLoading}
            >
              {isEditLoading ? "Loading..." : "Delete"}
            </button>
            <button id='saveChangesBtn'
              onClick={() => { handleUpdate() }}
              className={`
                    w-1/2
                    px-3 py-1 rounded-lg 
                    ease-out duration-200 
                    cursor-pointer bg-bgGreen1
                    active:bg-green-600
                    ${isEditLoading ? "opacity-50 hover:scale-100 cursor-not-allowed" : "hover:scale-110"}
                    `}
              disabled={isEditLoading}
            >
              {isEditLoading ? "Loading..." : "Update"}
            </button>
          </div>
        )
      }
      <p className={`
      ${isEditError ? 'text-red-500' : 'text-green-500'}
      `}>
        {editMsg}
      </p>
    </div>
  )
}


