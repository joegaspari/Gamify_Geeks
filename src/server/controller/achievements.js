import * as achievementsModel from '../data/achievements.js';

export async function getAchievements(req, res) {
    const studentId = req.query.studentId;
    const userId = studentId?studentId:req.userId;

    try {
        const [
            countSolved,
            countAttempted,
            sumHours,
            averageHoursResult,
            countSolvedDif,
            countAttemptedDif,
            sumHoursDif,
            avgHoursDif
        ] = await Promise.all([
            achievementsModel.findProblemsCompleted(userId),
            achievementsModel.findProblemsAttempted(userId),
            achievementsModel.findTotalHours(userId),
            achievementsModel.findAverageHours(userId),
            achievementsModel.findChangeProblems(userId),
            achievementsModel.findChangeAttempted(userId),
            achievementsModel.findTotalHoursDifference(userId),
            achievementsModel.findAverageHoursDif(userId)  
        ]);
    const achievements = [
        {
            id: 1,
            rate: countSolved,
            num: countSolvedDif
        },
        {
            id: 2,
            rate: countAttempted,
            num: countAttemptedDif
        },
        {
            id: 3,
            rate: sumHours,
            num: sumHoursDif
        },
        {
            id: 4,
            rate: averageHoursResult,
            num: avgHoursDif
        }
    ];
    res.status(200).json(achievements);
    } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
    }
    
}