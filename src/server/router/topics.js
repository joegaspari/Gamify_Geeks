import express from 'express';
import 'express-async-errors';
import { isAuth } from '../middleware/auth.js';
import * as topics from '../controller/topics.js';

const router = express.Router();

router.post('/topicCard', isAuth, topics.getTopicCard);

router.get('/languages', isAuth, topics.getLanguages);

router.get('/difficulties', isAuth, topics.getDifficulty);

router.get('/languagesBytopic/:topicId', topics.getlanguagesByTopic);

router.get('/attemptedQuestions', isAuth, topics.getAttemptedQuestions);

export default router;