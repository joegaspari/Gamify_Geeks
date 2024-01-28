import * as analyticsModel from "../data/analytics.js";
import * as analytics from "../data/analytics.js";

export async function getAnalytics(req, res) {
    const userId = req.userId || req.body.studentId;
    const classId = req.body.classId;

    const valid = await analyticsModel.isInClass(userId, classId);

    console.log(userId);
    console.log(classId);
    if (valid == null) {
        res.status(401).json({ message: "Student is not in the class" });
        return;
    }

    try {
        // rates
        const [studentCount, solved, assignments, timeSpent, QDIF, ADIF, AVGDIF] = await Promise.all([
            analyticsModel.getStudentCount(classId),
            analyticsModel.getQuestionsSolved(userId, classId),
            analyticsModel.getAssignmentCount(classId),
            analyticsModel.getSolvingTime(userId, classId),
            analyticsModel.getQuestionsSolvedDif(userId, classId),
            analyticsModel.getAssignmentCountDif(classId),
            analyticsModel.getAverageSolvingTimeDIF(classId)
        ]);

        const analytics = [
            {
                id: 1,
                rate: studentCount,
                num: null,
            },
            {
                id: 2,
                rate: solved,
                num: QDIF,
            },
            {
                id: 3,
                rate: assignments,
                num: ADIF,
            },
            {
                id: 4,
                rate: timeSpent == null ? 0 : timeSpent,
                num: AVGDIF,
            },
        ];

        res.status(200).json(analytics);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
}

export async function getLeaderboard(req, res) {
    const userId = req.body.studentId || req.userId;
    const classId = req.body.classId;
    try {
        const valid = await analyticsModel.isInClass(userId, classId);

        if (valid == null) {
            res.status(401).json({ message: "Student is not in the class" });
            return;
        }

        const topStudents = await analyticsModel.classLeaderboard(classId);

        const response = topStudents.map((student, index) => {
            return {
                ...student,
                rank: index + 1,
            };
        });
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
    }
}

export async function getWeeklyProgress(req, res) {
    const userId = req.body.studentId || req.userId;
    const classId = req.body.classId;
    try {
        const valid = await analyticsModel.isInClass(userId, classId);

        if (valid == null) {
            res.status(401).json({ message: "Student is not in the class" });
            return;
        }

        const weeklyStats = await analyticsModel.getWeeklyStats(classId);

        return res.status(200).json(weeklyStats);
    } catch (err) {
        console.log(err);
    }
}

export async function getMonthStreak(req, res) {
    const studentId = req.body.studentId || req.userId;
    const year = req.query.year;
    const month = req.query.month;
    try {
        if (!studentId || !year || !month) {
            return res.status(400).json({ error: "All fields month, year, userId are required." });
        }

        const result = await analytics.getSteaks(month, year, studentId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message || "Failed to getMonthStreak" });
    }
}

export async function getTotalStreak(req, res) {
    const studentId = req.body.studentId || req.userId;
    try {
        if (!studentId) {
            return res.status(400).json({ error: "studentId is required." });
        }
        const result = await analytics.getTotalSteaks(studentId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message || "Failed to get total streaks" });
    }
}
