import React, { useState } from 'react';
import { isTouchEvent } from 'react-movable/lib/utils';
import EyesIcon from './icon/EyesIcon';
import ClosedEyeIcon from './icon/ClosedEyeIcon';
import SixDotsIcon from './icon/SixDotsIcon';
import LargePencil from './icon/pencil/LargePencil';

export default function AssignmentCard({
  moduleData,
  assignmentData,
  handleToggleAssignmentVisiblity,
  handleSelectAssignment,
  selectedId
}) {


  const { moduleId: selectedModuleId, assignmentId: selectedAssigmentId } = selectedId;

  const { id: thisModuleId } = moduleData;

  const {
    id: thisAssignmentId,
    name,
    numberOfQuestions,
    topic,
    topicId,
    difficulty,
    diffId,
    language,
    langId,
    status,
    deadline,
    visible,
    sampleQuestion
  } = assignmentData;



  const [isAssignmentVisible, setIsAssignmentVisible] = useState(visible);
  const toggleAssignmentVisiblity = (e) => {
    e.stopPropagation();
    setIsAssignmentVisible(prev => prev == 1 ? 0 : 1);
    handleToggleAssignmentVisiblity(thisModuleId, thisAssignmentId);
  }

  const onSelectAssignment = (e) => {
    e.stopPropagation();
    handleSelectAssignment(thisModuleId, thisAssignmentId);
  }

  const questionText = numberOfQuestions ? `${numberOfQuestions}` : '(?)';
  const topicText = topic ? `${topic}` : '(?)';
  const languageText = language ? `${language}` : '(?)';
  const deadlineText = deadline ? `${deadline}` : '(?)';



  return (
    <div className={`assignment flex p-5 m-0 justify-between  border-t border-white3
    ${selectedModuleId == thisModuleId && selectedAssigmentId == thisAssignmentId ? 'bg-bgBlue3' : 'bg-white1'}
    `}>
      <div className="flex w-fit gap-5">
        <div className="flex items-center touch-target cursor-grab focus:cursor-grabbing">
          <SixDotsIcon />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-black1 text-xl font-medium leading-4">
            {name || "New Assignment"}
          </h2>
          <p className="text-black2 text-sm font-light leading-3">
            {`Solve ${questionText} ${topicText} Questions in ${languageText} by `}
            <span className={`${deadline && "font-semibold text-black1"}`}>
              {deadlineText}
            </span>
          </p>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <button id='assignmentVisibilityBtn' onClick={(e) => { toggleAssignmentVisiblity(e) }}
          className={`
        h-7 w-7
        hover:scale-105 hover:bg-bgBlue2
        transition-all ease-in duration-200
        flex items-center
        cursor-pointer
        rounded-full
        ${typeof thisAssignmentId === 'string' && thisAssignmentId.includes('index') ? 'hidden' : 'block'}
        `}
        >
          {isAssignmentVisible ? <EyesIcon /> : <ClosedEyeIcon />}
        </button>
        <button id='assignmentEditBtn' onClick={(e) => { onSelectAssignment(e) }}
          className={`
        h-6 w-6
        flex items-center
        hover:scale-105 hover:bg-bgBlue2
        transition-all ease-in duration-200
        rounded-full
        cursor-pointer
        `}
        >
          <LargePencil />
        </button>
      </div>
    </div >
  );
}
