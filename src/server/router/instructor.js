import express from 'express';
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import * as instructorController from '../controller/instructor.js';

const router = express.Router();

router.post('/createClass', isAuth, instructorController.isInstructor, instructorController.createClass);
router.get('/overview', isAuth, instructorController.isInstructor, instructorController.getClassOverview);
router.put('/edit', isAuth, instructorController.isInstructor, instructorController.editClass);
router.delete('/delete', isAuth, instructorController.isInstructor, instructorController.deleteClass);

// class analytics
router.post('/analytics', isAuth, instructorController.isInstructor, instructorController.getClassAnalytics);
router.post('/weekly',isAuth, instructorController.isInstructor, instructorController.getWeeklyProgress);
router.post('/leaderboard', isAuth, instructorController.isInstructor, instructorController.getClassLeaderboard);
export default router;