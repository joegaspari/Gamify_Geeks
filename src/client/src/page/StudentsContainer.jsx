import React from 'react';
import Students from './Students';
import { useAuth } from '../context/AuthContext';
import NotFound from './NotFound';

const StudentsContainer = (props) => {

    const { user } = useAuth(); 

    const isInstructor = user?.userRoleId == 3;

    return isInstructor ? <Students/> : <NotFound/> ;
}

export default StudentsContainer;