import React, { useEffect, useState } from 'react';
import BlackRightArrow from './icon/arrow/BlackRightArrow';
import XIcon from './icon/process/XIcon';
import CheckIcon from './icon/process/CheckIcon';
import ProcessingIcon from './icon/process/ProcessingIcon';
import BlackDownwardArrow from './icon/arrow/BlackDownwardArrow';

export default function ModuleBoxForStudent({
  modulesData, boxesStatus, toggleBox, size = 'medium', selectedAssignmentId, setSelectedAssignmentId, selectable = false,
  selectedStudent
}) {

  const icons = [<XIcon />, <ProcessingIcon />, <CheckIcon />]

  const calculateModuleStatus = (module) => {
    var oneStartedAssignment = false;
    var oneIncompleteAssignment = false;

    for (var i = 0; i < module.assignments.length; i++) {
      if (oneStartedAssignment && oneIncompleteAssignment) {
        break;
      }
      if (module.assignments[i].status != 3) {
        oneIncompleteAssignment = true
      }
      if (module.assignments[i].status != 1) {
        oneStartedAssignment = true
      }
    }

    if (oneStartedAssignment && oneIncompleteAssignment) { // Started atleast one and hasn't finished atleast one
      return 2
    } else if (oneStartedAssignment) { // Complete
      return 3
    } else { // Incomplete
      return 1
    }
  }

  const handleSelectAssignment = (moduleId, assignmentId) => {
    if (!selectable) {
      return;
    }
    setSelectedAssignmentId({ moduleId, assignmentId });
  }

  return (
    <div
      id='modules-container'
      className={`
        flex flex-col
        ${size === 'small' ? 'gap-5' : 'gap-7'}
        `}
    >
      {
        selectedStudent && modulesData.length == 0 &&
        <div>
          <p className={`rounded-[20px] shadow-standard text-lg bg-white1 p-base`}
          >{`The student (username: ${selectedStudent.username}) Doesn't have any module`}</p>
        </div>
      }
      {modulesData && modulesData.map((module) => (
        <div key={module.id} className={`module rounded-[20px] shadow-standard`}>
          <div>
            <div className={`
                    transition-all
                    duration-150
                    min-h-[20px]
                    rounded-[20px] bg-offWhite2   
                    flex items-center  justify-between 
                    ${size === 'small' ? 'px-5 py-2 gap-1' : 'px-base py-sm  gap-4'}
                    ${boxesStatus[`${module.id}_modules`] ? 'rounded-b-none bg-offWhite2' : 'bg-white1'}
                    `}
            >
              <div className={`flex items-center w-5/6 ${size === 'small' ? 'gap-2' : 'gap-4 '}`}>
                <p className={`font-medium text-black1 ${size === 'small' ? 'text-lg' : 'text-xl'} leading-6`}>
                  {`${module.title}`}
                </p>
                <div
                  id={`${module.id}_modules`}
                  onClick={(e) => toggleBox(e.currentTarget.id)}
                  className={` toggleBtn
                            flex justify-center items-center 
                            rounded-full
                            cursor-pointer
                            hover:bg-bgBlue2
                            transition-all
                            duration-150
                            h-7 w-7
                            `}
                // ${boxesStatus[`${module.id}_modules`] ? 'h-10 w-7' : 'h-7 w-10'}
                >
                  {boxesStatus[`${module.id}_modules`] ? <BlackRightArrow /> : <BlackDownwardArrow />}
                </div>
              </div>
              {icons[calculateModuleStatus(module) - 1]}
            </div>

            {module.assignments.map((assignment, index) => (
              <div key={assignment.id} name={assignment.name}
                className={`assignment ${boxesStatus[`${module.id}_modules`] ? 'flex' : 'hidden'} 
                ${index == module.assignments.length - 1 && 'rounded-b-[20px] rounded-bl-[20px]'} 
                ${selectedAssignmentId && selectedAssignmentId.moduleId == module.id && selectedAssignmentId.assignmentId == assignment.id ? 'bg-bgBlue3' : 'bg-white1'}
                transition-all duration-150 hover:scale-105 hover:border-b 
                hover:mb-[1px] cursor-pointer flex px-base py-sm m-0 
                justify-between border-t border-white3`}

                onClick={() => handleSelectAssignment(module.id, assignment.id)}
              >

                <div className="flex w-fit gap-5">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-black1 text-xl font-medium leading-4">
                      {assignment.name}

                    </h2>
                    <p className="text-black2 text-sm font-light leading-3">
                      {`Solve ${assignment.numberOfQuestions} ${assignment.topic} Questions in ${assignment.language}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {assignment.status && 1 <= assignment.status <= 3 ? icons[assignment.status - 1] : <XIcon />}
                </div>
              </div>
            ))}

          </div>
        </div>
      ))}

    </div>
  );
}
