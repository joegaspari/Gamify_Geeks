import express from 'express';
import 'express-async-errors';
import * as sModule from '../controller/modules.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/getStudentClassModule', isAuth, sModule.getClassModule);

router.get('/getInstructorClassModule', isAuth, sModule.getInstructorModules);

router.post('/createModule', isAuth, sModule.createModule);

router.delete('/deleteModule', isAuth, sModule.deleteModule);

router.post('/changeVis', isAuth, sModule.changeVisibility);

//TODO: need updateModule


export default router;
