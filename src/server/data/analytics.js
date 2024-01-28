import ClassStudent from "../models/classStudent.js";
import Assignment from "../models/assignment.js";
import Module from "../models/module.js";
import Class from '../models/class.js'
import StudentAssignmentQuestion from '../models/studentAssignmentQuestion.js';
import AssignmentStudyLog from "../models/assignmentStudyLog.js";
import {Op, Sequelize} from 'sequelize';
import Users from "../models/users.js";
import Learner from "../models/learner.js";
import sequelize from "../models/database.js";
import pool from '../connection/sqlconnect.js';
import * as utils from '../Utils/utils.js';

export async function isInClass(userId, classId) {
    return ClassStudent.findOne({where: {userId, classId}});
}

export async function getStudentCount(classId) {
    try{
        const count = await ClassStudent.count({
            where: {
                classId: classId
            }
        });

        return count;
    } catch(err) {
        console.log(err);
    }
}


export async function getAssignmentCount(classId) {
    try {
        const total = await Assignment.count({
            include: [{
                model: Module,
                as: 'module',
                where: {classId},
                required: true
            }]
        });

        return total;
    } catch (err) {
        console.log(err);
    }
}
export async function getAverageSolvingTimeDIF(classId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    try {
        const classAssignments = await StudentAssignmentQuestion.findAll({
            where: { classId,
                     dateCreated: {
                        [Op.lt]: today, // Use the less than operator to filter dates before today
                        } },
            attributes: ['assignmentId']
        });

        const assignmentIds = classAssignments.map(a=> a.assignmentId);

        const totalHours = await AssignmentStudyLog.findAll({
            where: {
                assignmentId: {
                    [Op.in]: assignmentIds
                }
            },
            attributes: [[Sequelize.fn('SUM', Sequelize.col('studyHours')), 'totalStudyHours']]
        });

        const totalStudents = await ClassStudent.count({
            where: { classId }
        });

        let avg = (totalHours[0].dataValues.totalStudyHours || 0) / totalStudents;

        if(avg == null || avg == 'undefined'){
            avg = 0;
        }
        let totalYest = await getAverageSolvingTime(classId);

        const increase = Number(totalYest) - Number(avg);
        return increase;

    } catch (error) {
        console.log(error);
    }
}
export async function getAssignmentCountDif(classId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    try {
        const total = await Assignment.count({
            where: {
                    createdOn: {
                        [Op.lt]: today, // Use the less than operator to filter dates before today
                    }
            },
            include: [{
                model: Module,
                as: 'module',
                where: {
                    classId: classId
                },

                required: true
            }]
        });
        if(total == null || total == 'undefined'){
            total = 0;
        }
        let totalYest = await getAssignmentCount(classId);

        const increase = Number(totalYest) - Number(total);
        return increase;
    } catch (err) {
        console.log(err);
    }
}

export async function getQuestionsSolved(userId, classId ) {
    try {


        const questions = await StudentAssignmentQuestion.count({
            where: {userId, classId, completed: 1,}
        });

        return questions;
    } catch (err) {
        console.log(err);
    }
}

export async function getQuestionsSolvedDif(userId, classId ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    try {
        const total = await StudentAssignmentQuestion.count({
            where: {userId, classId, completed: 1, dateCompleted: {
                [Op.lt]: today, // Use the less than operator to filter dates before today
            }}
        });
        if(total == null || total == 'undefined'){
            total = 0;
        }
        let totalYest = await getQuestionsSolved(userId, classId );

        const increase = Number(totalYest) - Number(total);
        return increase;
    } catch (err) {
        console.log(err);
    }
}

export async function getAverageQuestionsSolvedDIFF(classId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    try {
        const totalSolvedQuestions = await StudentAssignmentQuestion.count({
            where: {
                classId: classId,
                completed: 1,
                dateCompleted: {
                       [Op.lt]: today, // Use the less than operator to filter dates before today
                       } ,
            }
        });

        const totalStudents = await ClassStudent.count({
            where: {classId}
        });
        if (totalStudents === 0) {
            return 0;
        }

        const averageSolvedQuestions = totalSolvedQuestions/totalStudents;

        const oldAvg = await getAverageQuestionsSolved(classId);

        if(oldAvg == null || oldAvg == 'undefined'){
            oldAvg = 0;
        }

        const increase =  Number(oldAvg) - Number(averageSolvedQuestions);
        return increase;
    } catch (err) {
        console.log(err);

    }
}

export async function getAverageQuestionsSolved(classId) {
    try {
        const totalSolvedQuestions = await StudentAssignmentQuestion.count({
            where: {
                classId: classId,
                completed: 1
            }
        });

        const totalStudents = await ClassStudent.count({
            where: {classId}
        });
        if (totalStudents === 0) {
            return 0;
        }

        const averageSolvedQuestions = totalSolvedQuestions/totalStudents;

        return averageSolvedQuestions;
    } catch (err) {
        console.log(err);

    }
}

export async function getSolvingTime(userId, classId) {
    try {
        const classAssignments = await StudentAssignmentQuestion.findAll({
            where: {userId, classId},
            attributes: ['assignmentId']
        });

        const assignmentIds = classAssignments.map(a=> a.assignmentId);

        const totalHours = await AssignmentStudyLog.findAll({
            where: {
                userId,
                assignmentId: {
                    [Op.in]: assignmentIds
                }
            },
            attributes: [[Sequelize.fn('SUM', Sequelize.col('studyHours')), 'totalStudyHours']]
        });

        return totalHours && totalHours.length > 0 ? totalHours[0].dataValues.totalStudyHours: 0;
    } catch (err) {
        console.log(err);
    }
}

export async function getAverageSolvingTime(classId) {
    try {
        const classAssignments = await StudentAssignmentQuestion.findAll({
            where: { classId },
            attributes: ['assignmentId']
        });

        const assignmentIds = classAssignments.map(a=> a.assignmentId);

        const totalHours = await AssignmentStudyLog.findAll({
            where: {
                assignmentId: {
                    [Op.in]: assignmentIds
                }
            },
            attributes: [[Sequelize.fn('SUM', Sequelize.col('studyHours')), 'totalStudyHours']]
        });

        const totalStudents = await ClassStudent.count({
            where: { classId }
        });

        if(totalStudents === 0) {
            return 0;
        } else {
            return (totalHours[0].dataValues.totalStudyHours || 0) / totalStudents;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function classLeaderboard(classId) {
    const students = await ClassStudent.findAll({
        where: { classId },
        include: [
            {
                model: Learner,
                as: 'learner',
                include: [
                    {
                        model: Users,
                        as: 'users',
                        attributes: ['userId', 'firstName', 'lastName']
                    }
                ]
            }
        ],
        limit: 20
    });

    const studentScores = await Promise.all(
        students.map(async(student) => {
            const completedQuestions = await StudentAssignmentQuestion.count({
                where: {
                    userId: student.userId,
                    classId,
                    completed: 1
                }
            });

            return {
                userId: student.userId,
                score: completedQuestions,
                name: student.learner.users.firstName + ' ' + student.learner.users.lastName,
                img: null
            };
        })
    );

    // Sort students by score and assign their ranks
    studentScores.sort((a,b)=> b.score - a.score);
    let rank =  1, lastScore = Infinity;
    studentScores.forEach(student => {
        if(student.score < lastScore) {
            rank++;
            lastScore = student.score;
        }
        student.rank = rank;
    });

    return studentScores;


}

export async function getWeeklyStats(classId) {
    const sql = `
    SELECT DaysOfWeek.id, DaysOfWeek.day, IFNULL(COUNT(StudentAssignmentQuestion.dateCreated), 0) as attempted, IFNULL(SUM(StudentAssignmentQuestion.completed), 0) as solved
    FROM 
        (SELECT 1 as id, 'Monday' as day
        UNION ALL SELECT 2, 'Tuesday'
        UNION ALL SELECT 3, 'Wednesday'
        UNION ALL SELECT 4, 'Thursday'
        UNION ALL SELECT 5, 'Friday'
        UNION ALL SELECT 6, 'Saturday'
        UNION ALL SELECT 7, 'Sunday') DaysOfWeek
    LEFT JOIN StudentAssignmentQuestion
    ON WEEKDAY(StudentAssignmentQuestion.dateCreated)+1 = DaysOfWeek.id
    WHERE StudentAssignmentQuestion.classId = ${classId} OR StudentAssignmentQuestion.classId IS NULL
    GROUP BY DaysOfWeek.id, DaysOfWeek.day
    ORDER BY DaysOfWeek.id
    `
    const [rows,fields] = await pool.query(sql);

    return rows;

}

export async function checkDayForQuestion(date, userId){
    //here we are going to look at all questions in assignment or learner tables that are completed for a particular day
    try{
        if (date == null || date == 'undefined'){
            throw "date is null or undefined";
        }
        if (userId == null || userId == 'undefined'){
            throw "userId is null or undefined";
        }
        const sql = `SELECT LearnerQuestions.dateCompleted, LearnerQuestions.completed FROM gamifyDb.LearnerQuestions WHERE DATE(LearnerQuestions.dateCompleted) = ? AND LearnerQuestions.completed = 1 AND LearnerQuestions.userId = ?`;
        const sql2 = `SELECT StudentAssignmentQuestion.completed, StudentAssignmentQuestion.dateCompleted FROM gamifyDb.StudentAssignmentQuestion WHERE DATE(StudentAssignmentQuestion.dateCompleted) = ? AND StudentAssignmentQuestion.completed = 1 AND StudentAssignmentQuestion.userId = ?`;
        const raw = await pool.query(sql, [date, userId]);
        const raw2 = await pool.query(sql2, [date, userId]);
        if (raw[0].length != 0 || raw2[0].length != 0){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
        return {error: err};
    }
}

export async function getSteaks(month, year, userId){
    try{
        if (month == null || month == 'undefined'){
            throw "month is null or undefined";
        }
        if (year == null || year == 'undefined'){
            throw "year is null or undefined";
        }
        if (userId == null || userId == 'undefined'){
            throw "userId is null or undefined";
        }
        const dates = utils.getDaysInMonth(year, month);
        let result = [];
        for(let i=0; i<dates.length; i++){
            const streakDay = await checkDayForQuestion(dates[i], userId);
            result.push({
                date: dates[i],
                tag: streakDay
            })
        };
        return result;

    }catch(err){
        console.log(err);
        return {error: err};
    }
}

export async function getTotalSteaks(userId){
    try{
        let tag = true;
        let currentDate = new Date().toISOString().split('T')[0];
        let count = 0;
        while(tag){
            tag = await checkDayForQuestion(currentDate, userId)
            console.log(tag);
            count = tag ? count+1 : count;
            currentDate = tag ? utils.previousDate(currentDate) : currentDate;
        }
        return {
            streakCount:count
        }
    }catch(err){
        console.log(err);
        return {error: err};
    }
};
