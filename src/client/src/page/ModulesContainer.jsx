import React from 'react';
import Modules from './Modules';
import ModulesForInstructor from './ModulesForInstructor';
import { useAuth } from '../context/AuthContext';

export default function ModulesContainer(props) {
  const { user } = useAuth(); 

  const isInstructor = user?.userRoleId === 3;

  return !isInstructor ? <Modules /> : <ModulesForInstructor />;
}
