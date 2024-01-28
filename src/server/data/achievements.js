import LearnerQuestions from '../models/learnerQuestions.js';
import LearnerStudyLog from '../models/learnerStudyLog.js';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

export async function findProblemsCompleted(userId) {
    return LearnerQuestions.count({where: {userId: userId, completed: 1}});
}

export async function findProblemsAttempted(userId) {
    return LearnerQuestions.count({where: {userId: userId}})
}

export async function findTotalHours(userId) {
    const totalHours = await LearnerStudyLog.sum('studyHours', {where: {userId: userId}});
    return totalHours || 0;
}

export async function findAverageHours(userId) {
    const result = await LearnerStudyLog.findOne({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('studyHours')), 'averageHoursPerDay']],
        where: {
            userId: userId
        }
    });

    const averageHoursPerDay = result ? result.get('averageHoursPerDay') : 0;
    return averageHoursPerDay || 0;
}

export async function findChangeProblems(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    let yest = await LearnerQuestions.count({
        where: {
            userId: userId,
            completed: 1,
            dateCompleted: {
                [Op.lt]: today, // Use the less than operator to filter dates before today
            }
        }
    });

    if(yest == null || yest == 'undefined'){
        yest = 0;
    }
    let toda = await findProblemsCompleted(userId);

    const increase = Number(toda) - Number(yest);
    return increase;
};

export async function findChangeAttempted(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    const yest = await LearnerQuestions.count({
        where: {
            userId: userId,
            dateCompleted: {
                [Op.lt]: today, // Use the less than operator to filter dates before today
            }
        }
    });
    if(yest == null || yest == 'undefined'){
        yest = 0;
    }
    const toda = await findProblemsAttempted(userId);

    const increase = Number(toda) - Number(yest);
    return increase;
};


export async function findTotalHoursDifference(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    const totalHours = await LearnerStudyLog.sum('studyHours', {
        where: {
            userId: userId,
            studyDate: {
                [Op.lt]: today, // Use the less than operator to filter dates before today
            }
        }
    });

    const tot = totalHours || 0;
    const toda = await findTotalHours(userId);

    const increase = toda-tot;
    return increase;
};



export async function findAverageHoursDif(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison

    const result = await LearnerStudyLog.findOne({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('studyHours')), 'averageHoursPerDay']],
        where: {
            userId: userId,
            studyDate: {
                [Op.lt]: today, // Use the less than operator to filter dates before today
            }
        }
    });

    const averageHoursPerDay = result ? result.get('averageHoursPerDay') : 0;


    const toda = await findAverageHours(userId);
    const increase = toda - averageHoursPerDay;
    return increase;
};