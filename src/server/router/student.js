import express from 'express';
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import * as studentController from '../controller/student.js';

const router = express.Router();

router.post('/analytics', isAuth, studentController.getAnalytics);
router.post('/leaderboard', isAuth, studentController.getLeaderboard);
router.post('/weekly', isAuth, studentController.getWeeklyProgress);
router.get('/calStreak', isAuth, studentController.getMonthStreak);
router.get('/totalStreak', isAuth, studentController.getTotalStreak);
export default router;