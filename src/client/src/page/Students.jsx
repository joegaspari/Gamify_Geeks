import React, { useState, useCallback, useEffect } from 'react';
import ContentHeader from '../components/ContentHeader';
import StudentsTable from '../components/StudentsTable';
import HelpIcon from '../components/icon/HelpIcon';
import PlusIcon from '../components/icon/Plus/PlusIcon';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ContentBox from './ContentBox';
import ModuleBoxForStudent from '../components/ModuleBoxForStudent';
import { useData } from '../context/DataContext';
import AddStudentsPopup from '../components/AddStudentsPopup';
import { usePopup } from '../context/PopupContext';
import PopupOverlay from '../components/PopupOverlay';
import { useProfile } from '../context/ProfileContext';

export default function Students(props) {



  const { getStudentModules, getInstructorModules } = useData();

  const { popups, closePopup, openPopup } = usePopup();

  const [modulesData, setModulesData] = useState([]);

  const { mainCourse } = useProfile();

  const [boxesStatus, setBoxesStatus] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null)

  const toggleBox = useCallback((id) => {
    setBoxesStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);



  useEffect(() => {

    if (!mainCourse) {
      return
    }
    getInstructorModules(mainCourse.classId)
      .then((i) => {
        if (selectedStudent == null) {
          setModulesData(i)
        }
      });
  }, [getInstructorModules, mainCourse]);

  useEffect(() => {
    if (!mainCourse || !selectedStudent) {
      return
    }

    const params = {
      studentId: selectedStudent.id,
      classId: mainCourse.classId
    }

    console.log(params);
    getStudentModules(params)
      .then((i) => {
        console.log(i)
        setModulesData(i)
      });
  }, [selectedStudent])

  const closeAddStudentsPopup = () => {
    closePopup('addStudentsPopup')
  }


  const handleSelectStudent = (student) => {
    if (selectedStudent && student.id == selectedStudent.id) {
      setSelectedStudent(null)
    } else {
      setSelectedStudent({
        id: student.id,
        name: student.name
      })
    }
  }

  return (
    <ContentBox id={'students'}>
      <MainContent styles="gap-8">
        <ContentHeader
          title="Manage Students"
          subtitle="How are your student doing?"
          icons={[
            { id: 1, tag: <HelpIcon /> },
          ]}
          children={(
            <>
              <div className='h-full aspect-square flex items-center justify-center w-6'>
                <PlusIcon />
              </div>
              <p className="whitespace-nowrap" id="addStudentsPopup" onClick={(e) => openPopup(e.currentTarget.id)}>Add Students</p>
            </>
          )}
          childrenWidth="45%"
        />

        <section className="h-[80vh] flex flex-col bg-offWhite2 rounded-[20px] shadow-standard grow overflow-hidden gap-sm">

          <StudentsTable rowOnClick={handleSelectStudent} selectedId={selectedStudent && selectedStudent.id} />
        </section>
      </MainContent>

      <Sidebar>

        <h1 className="text-3xl font-semibold">{selectedStudent && `${selectedStudent.name}'s`} Module Progress</h1>
        <ModuleBoxForStudent modulesData={modulesData} boxesStatus={boxesStatus} toggleBox={toggleBox} />
      </Sidebar>
      {
        popups.addStudentsPopup &&
        <PopupOverlay closePopup={closeAddStudentsPopup}>
          <AddStudentsPopup closePopup={closeAddStudentsPopup} classCode={mainCourse.joinCode} />
        </PopupOverlay>


      }
    </ContentBox>
  );
}
