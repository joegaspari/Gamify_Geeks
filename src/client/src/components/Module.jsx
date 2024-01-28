import React, { useState } from 'react';
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import '../index.css';

import { List, arrayMove } from 'react-movable';
import AssignmentCard from './AssignmentCard';
import EyesIcon from './icon/EyesIcon';
import LargePencil from './icon/pencil/LargePencil';
import PlusIcon from './icon/Plus/PlusIcon';

import ClosedEyeIcon from './icon/ClosedEyeIcon';


export default function Module({
  moduleData,
  moduleIndex,
  handleToggleModuleVisiblity,
  handleClickEditModuleBtn,
  handleAddAssignment,
  setModulesData,
  handleToggleAssignmentVisiblity,
  handleSelectAssignment,
  selectedId,
  isEditLoading
}) {

  const { moduleId: selectedModuleId, assignmentId: selectedAssigmentId } = selectedId;

  const [initialModule, setInitialModule] = useState(moduleData);

  const reOrderAssignments = (newAssignments) => {
    setModulesData(prev => {
      const newModulesData = [...prev];

      newModulesData[moduleIndex] = {
        ...newModulesData[moduleIndex],
        assignments: newAssignments
      };

      return newModulesData;
    })
  }

  const { id, title, visible, assignments } = moduleData;

  const [isModuleVisible, setIsModuleVisible] = useState(visible);
  const toggleModuleVisiblity = (e) => {

    e.stopPropagation();
    if (isEditLoading) return;
    setIsModuleVisible(prev => prev == 1 ? 0 : 1);
    handleToggleModuleVisiblity(id);
  }

  const onClickEditModuleBtn = (e) => {

    e.stopPropagation();
    if (isEditLoading) return;
    handleClickEditModuleBtn(id);
  }

  const addAssignment = (e) => {
    e.stopPropagation();
    if (isEditLoading) return;
    setIsExpanded(true);
    handleAddAssignment(id);
  }

  const handleClickModule = (e) => {
    if (isEditLoading) {
      e.stopPropagation();
      return;
    }
    setIsExpanded(prev => !prev);

    if (assignments == 0) {
      alert("Add an assignment to this module");
      return;
    }
  }

  const [isExpanded, setIsExpanded] = useState(false);


  return (
    <AccordionItem dangerouslySetExpanded={isExpanded} onClick={handleClickModule}>
      <AccordionItemHeading>
        <AccordionItemButton>
          <div className={`
          flex m-0 justify-between relative
          rounded-md
          ${selectedModuleId == id ? '' : ''}
          `}>
            <div className="flex flex-col w-fit ml-2 gap-2">
              <h2 className="text-black1 text-xl font-medium">
                {title || initialModule.title || "New Module"}
              </h2>

              {
                assignments.length == 0 && (
                  <p className="text-black2 text-sm font-light leading-3">
                    {`Add an assignment to this module`}
                  </p>
                )
              }


            </div>
            <div className="flex gap-5 items-center  relative z-50">
              <button id='moduleVisibility' onClick={(e) => { toggleModuleVisiblity(e) }}
                className={`
              h-7 w-7
                hover:scale-105 hover:bg-bgBlue2
                transition-all ease-in duration-200
                flex items-center
                cursor-pointer
                rounded-full
                ${isEditLoading && "hover:scale-100 hover:bg-transparent"}
              `}
              >
                {isModuleVisible ? <EyesIcon /> : <ClosedEyeIcon />}
              </button>
              {/* for now we don't have edit module api */}
              <button id='editModuleForInstructorBtn' onClick={(e) => { onClickEditModuleBtn(e) }}

                className={`
              h-6 w-6
              flex items-center
              hover:scale-105 hover:bg-bgBlue2
              transition-all ease-in duration-200
              rounded-full
              cursor-pointer
              ${isEditLoading && "hover:scale-100 hover:bg-transparent"}
              `}
              >
                {<LargePencil />}
              </button>

              <button id='addAssignmentBtn' onClick={(e) => { addAssignment(e) }}
                className={`
              h-6 w-6
              flex items-center justify-between
              hover:scale-110 hover:bg-bgBlue2
              transition-all ease-in duration-200
              rounded-full
              cursor-pointer
              ${isEditLoading && "hover:scale-100 hover:bg-transparent"}
              `}
              >
                {<PlusIcon />}
              </button>
            </div>
          </div>
        </AccordionItemButton >
      </AccordionItemHeading >
      <AccordionItemPanel>
        <List
          values={assignments}
          onChange={({ oldIndex, newIndex }) => (
            reOrderAssignments(arrayMove(assignments, oldIndex, newIndex))
          )}
          renderList={({ children, props }) => <ul {...props}>{children}</ul>}
          renderItem={({ value, props }) => <li {...props} className='list-none' >
            <AssignmentCard
              assignmentData={value}
              moduleData={moduleData}
              handleToggleAssignmentVisiblity={handleToggleAssignmentVisiblity}
              handleSelectAssignment={handleSelectAssignment}
              selectedId={selectedId}
            />
          </li>}
          lockVertically
        />
      </AccordionItemPanel>
    </AccordionItem >
  );
}
