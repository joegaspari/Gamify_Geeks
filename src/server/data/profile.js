import Learner from "../models/learner.js";
import Users from "../models/users.js";
import Badge from "../models/badge.js";
import Class from "../models/class.js";
import ClassStudent from "../models/classStudent.js";
import Instructor from "../models/instructor.js";
import { Op } from "sequelize";
import pool from "../connection/sqlconnect.js";

export async function findByUserId(userId) {
    return Users.findOne({ where: { userId: userId } });
}

export async function findLearnerByUserId(userId) {
    return Learner.findOne({ where: { userId: userId } });
}
export async function getFavoriteBadge(selectedBadgeTitleId) {
    return Badge.findOne({ where: { badgeId: selectedBadgeTitleId } });
}

export async function findClasses(userId, search) {
    const data = ClassStudent.findAll({
        where: { userId },
        include: [
            {
                model: Class,
                as: "classStudent",
                required: true,
                where: {
                    name: {
                        [Op.like]: "%" + search + "%",
                    },
                },
                attributes: ["classId", "name", "description", "joinCode"],
            },
        ],
    });
    return data;
}
export async function findInstructorClasses(userId, search) {
    return Class.findAll({
        where: {
            userId,
            name: {
                [Op.like]: "%" + search + "%",
            },
        },
    });
}

export async function findClassByJoinCode(joinCode) {
    return Class.findOne({ where: { joinCode } });
}

export async function findStudentClass(userId, classId) {
    return ClassStudent.findOne({ where: { userId, classId } });
}

export async function joinClass(userId, classId) {
    return ClassStudent.create({ userId, classId });
}

export async function updateUser(userId, userData) {
    return await Users.update(userData, {
        where: { userId: userId },
    });
}

export async function updateLearnerSelectedBadge(userId, selectedBadgeId) {
    const learner = await findLearnerByUserId(userId);

    return await Learner.update(
        {
            selectedBadgeTitleId: selectedBadgeId,
        },
        {
            where: {
                userId: userId,
            },
        }
    );
}

export async function findInstructorbyUserId(userId) {
    return Instructor.findOne({ where: { userId: userId } });
}

export async function getUserTitles(userId) {
    try {
        const sql = `SELECT * FROM gamifyDb.LearnerBadges JOIN gamifyDb.Badge ON LearnerBadges.badgeId = Badge.badgeId
        AND LearnerBadges.userId = ?`;

        const [results] = await pool.query(sql, [userId]);

        console.log(" USER TITLES ");
        console.log(results);
        if (results.length === 0) {
            return [];
        } else {
            return results;
        }
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
