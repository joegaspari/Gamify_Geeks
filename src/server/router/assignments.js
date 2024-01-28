import express from 'express';
import 'express-async-errors';
import * as assignment from '../controller/assignment.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/createAssignment', isAuth, assignment.createAssignments);

router.post('/assignmentVis', assignment.changeVisibility);

router.delete('/inactivateA', assignment.inactivateA);

router.post('/linkStudentAssignment', isAuth, assignment.linkStudentAssignment);

router.post('/saveAssignmentQuestion', isAuth, assignment.saveAssignmentQuestion);

router.get('/updateQtime', isAuth, assignment.startQtime);

router.post('/getAssignmentQAnswer', isAuth, assignment.checkAssignmentAnswer);

router.post('/editAssignment', assignment.editAssignments);

router.post('/getStudentQuestions', isAuth, assignment.getStudentQs);

router.post('/studentStats', isAuth, assignment.getStudentStats);

router.post('/upcoming', isAuth, assignment.upcomingAssignments);

export default router;