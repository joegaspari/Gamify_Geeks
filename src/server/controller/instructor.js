import { findClassByJoinCode, findInstructorbyUserId } from "../data/profile.js";
import * as instructorModel from '../data/instructor.js';
import * as analyticModel from '../data/analytics.js';

export async function isInstructor(req, res, next) {
    const userId = req.userId;
    const found = await findInstructorbyUserId(userId);
    if(!found) {
        res.status(401).json({message: 'Invalid User Role'});
    }
    next();
}

export async function createClass(req, res) {
    const userId = req.userId;
    let found = false;
    let joinCode = '';
    while(!found) {
        joinCode = generateJoinCode();
        const foundClass = await findClassByJoinCode(joinCode);
        if(!foundClass){
            found = true;
        }
    }
    const {name, description} = req.body;
    const newClass = await instructorModel.newClass(userId, name, description, joinCode);
    if(newClass) {
        res.status(201).json(newClass);
    } else {
        res.status(400);
    }   


}

function generateJoinCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = Math.floor(Math.random()*6) +5; // random number between 5 and 10

    for (let i =0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random()*characters.length));
    }

    return result;
}

export async function getClassOverview(req, res) {
    const userId = req.userId;
    try{
        const classes = await instructorModel.getClasses(userId);
        res.status(200).json(classes);
    } catch(err) {
        console.log(err);
        res.status(500);
    }
}

export async function editClass(req, res) {
    const userId = req.userId;
    const {name, description, classId} = req.body;
    try {
        const result = await instructorModel.updateClass(userId, classId, name, description);
        if(result) {
            res.status(200).json(result);
        }
    } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
}

export async function deleteClass(req, res) {
    const userId = req.userId;
    const {classId} = req.body;
    if(!classId) {
        return res.status(400).json({message: 'Missing ClassId!'});
    }
    try {
        const result = await instructorModel.deleteClassById(classId);
        if(result === 0 ) {
            return res.status(404).json({message: 'Class Not found'});
        }
        res.status(200).json({message: 'Class deleted successfully'});
        
    } catch(err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
}

export async function getClassAnalytics(req, res) {
    const {classId} = req.body;
    if(!classId) {
        return res.status(401).json({message: 'Invalid classId'});
    }
    try {
        const [
            studentCount,
            averageSolved,
            assignmentCount,
            averageTime,
            ASDIFF,
            solvedDif,
            timeDiff
        ] = await Promise.all([
            analyticModel.getStudentCount(classId),
            analyticModel.getAverageQuestionsSolved(classId),
            analyticModel.getAssignmentCount(classId),
            analyticModel.getAverageSolvingTime(classId),
            analyticModel.getAssignmentCountDif(classId),
            analyticModel.getAverageQuestionsSolvedDIFF(classId),
            analyticModel.getAverageSolvingTimeDIF(classId)
        ]);

        const analytics = [
            {
                id: 1,
                rate: studentCount,
                num: null
            },
            {
                id: 2,
                rate: averageSolved,
                num: solvedDif
            },
            {
                id: 3,
                rate: assignmentCount,
                num: ASDIFF
            },
            {
                id: 4,
                rate: averageTime ? averageTime: 0,
                num: timeDiff
            }
        ];

        res.status(200).json(analytics);
    } catch( err ) {
        console.log(err);
    }
}

export async function getWeeklyProgress(req, res) {
    const {classId} = req.body;

    try {
        if(!classId) {
            return res.status(401).json({message: 'Invalid classId'});
        }
    
        const weeklyStats = await analyticModel.getWeeklyStats(classId);
    
        return res.status(200).json(weeklyStats);
    } catch (error) {
        console.log(error);
    }
}

export async function getClassLeaderboard(req, res) {
    const {classId} = req.body;

    try {
        if(!classId) {
            return res.status(401).json({message: 'Invalid classId'});
        }
        
        const topStudents = await analyticModel.classLeaderboard(classId);

        return res.status(200).json(topStudents);
        
    } catch (error) {
        console.log(error);
    }
}