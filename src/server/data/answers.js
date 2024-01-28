import pool from "../connection/sqlconnect.js";
import { generateFeedback } from "../controller/generate.js";
import * as utils from "../Utils/utils.js";
import * as assignments from "../data/assignments.js";

export async function checkUserStudyDate(userId) {
    try {
        //This function will query the Learner Study Log table and if the table contains a user id and date it will return the data to insertTime Learner
        const sql = `SELECT LearnerStudyLog.studyDate, LearnerStudyLog.studyHours FROM gamifyDb.LearnerStudyLog WHERE LearnerStudyLog.userId = ${userId} AND LearnerStudyLog.studyDate = curdate()`;
        const raw = await pool.query(sql);
        const data = raw[0].length == 0 ? null : { studydate: raw[0][0].studyDate, studyhour: raw[0][0].studyHours };

        return data;
    } catch (err) {
        return err;
    }
}

export async function insertTimeLearner(userId, time) {
    try {
        // first convert the time stamp into a date
        const checkData = await checkUserStudyDate(userId);
        if (checkData != null) {
            // //Else we now update the row that currently exists
            const studyHours = parseFloat(checkData.studyhour) + parseFloat(time);
            const sql = `UPDATE gamifyDb.LearnerStudyLog SET LearnerStudyLog.studyHours = ${studyHours} WHERE LearnerStudyLog.studyDate = curdate() AND LearnerStudyLog.userId = ${userId}`;
            const raw = await pool.query(sql);

            return raw[0];
        } else {
            const sql = `INSERT INTO gamifyDb.LearnerStudyLog(userId, studyDate, studyHours) VALUES (${userId}, curdate(), ${time})`;
            const raw = await pool.query(sql);
            if (raw[0].length == 0) {
                return false;
            }
            return true;
        }
    } catch (err) {
        console.log(err);
        return { error: "Failed to insert time into LearnerStudyLogs" };
    }
}

export async function save(questionId, userId, textContent) {
    try {
        // On Save We want to take the current time stamp from the associated
        // LearnerQuestion, we want to then subtract the time and return the difference

        // 1.) Get the learnerQuestion LOG
        const raw = await pool.query(
            `SELECT LearnerQuestions.dateCompleted AS dateCreated, LearnerQuestions.timeTaken FROM gamifyDb.LearnerQuestions WHERE LearnerQuestions.questionId = ${questionId} AND LearnerQuestions.userId = ${userId} AND LearnerQuestions.completed = 0`
        );
        const data = raw[0].map((item) => {
            return {
                dateCreated: item.dateCreated,
                timeTaken: item.timeTaken,
            };
        });
        const currentTime = data[0].dateCreated;

        const diffTimeHrs = await utils.timeDifference(currentTime);
        const timetaken = data[0].timeTaken == null ? 0.0 : data[0].timeTaken;
        const tofloat = parseFloat(diffTimeHrs);

        // Ramos: Changed timetaken to TEMP
        const insertTimeLearners = await insertTimeLearner(userId, tofloat);
        if (!insertTimeLearners) {
            throw "Time was not inserted into learner Study logs";
        }

        const newTime = parseFloat(timetaken) + parseFloat(diffTimeHrs);
        // TODO: Change TEMP back to newTime (Changed it as newTime was NaN - Ramos)
        const raw2 = await pool.query(
            `UPDATE gamifyDb.LearnerQuestions SET LearnerQuestions.timeTaken = ${newTime}, LearnerQuestions.partialAnswer = "${textContent}", LearnerQuestions.dateCompleted = CURRENT_TIMESTAMP WHERE LearnerQuestions.questionId = ${questionId} AND LearnerQuestions.userId = ${userId}`
        );
        return raw2[0];
        // We want to store partial text content
    } catch (err) {
        console.log(err);
        return { error: "Failed to Save Answer Content" };
    }
}

export async function getPromptInfo(questionId) {
    try {
        if (questionId == null || questionId == "undefined") {
            throw "Question Id is null or undefined";
        }
        const sql = `SELECT Question.questionId, QuestionPrompt.programmingLanguageId, QuestionPrompt.proficiencyLevelId  FROM gamifyDb.Question LEFT JOIN gamifyDb.QuestionPrompt ON Question.questionPromptId = QuestionPrompt.questionPromptId WHERE Question.questionId = ?`;
        const raw = await pool.query(sql, [questionId]);
        return {
            progId: raw[0][0].programmingLanguageId,
            profId: raw[0][0].proficiencyLevelId,
        };
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

export async function getBadge(userId, questionId) {
    try {
        if (questionId == null || questionId == "undefined") {
            throw "Question Id is null or undefined";
        }
        if (userId == null || userId == "undefined") {
            throw "user Id is null or undefined";
        }
        const promptInfo = await getPromptInfo(questionId);
        const sql = `SELECT UserMilestone.objective, UserMilestone.userId, UserMilestone.progress, Badge.iconpath, Badge.title 
        FROM gamifyDb.UserMilestone 
        LEFT JOIN gamifyDb.Milestone ON UserMilestone.milestoneId = Milestone.milestoneId 
        LEFT JOIN gamifyDb.Badge ON Milestone.badgeId = Badge.badgeId
        WHERE UserMilestone.userId = ? AND Milestone.programmingLanguageId = ? AND Milestone.proficiencyLevelId = ? AND UserMilestone.progress >= 1`;
        const raw = await pool.query(sql, [userId, promptInfo.progId, promptInfo.profId]);
        return raw[0][0];
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

export async function checkA(userId, questionId, answer, res) {
    try {
        //1.) Get the question content from learner question
        const raw = await pool.query(`SELECT Question.textContent FROM gamifyDb.Question WHERE Question.questionId = ${questionId}`);
        const data = raw[0].map((item) => {
            return {
                txt: item.textContent,
            };
        });
        const text = data[0].txt;

        const { correct, feedback } = await generateFeedback(text, answer, res);

        if (correct) {
            const raw2 = await pool.query(
                `SELECT LearnerQuestions.dateCompleted AS time, LearnerQuestions.timeTaken FROM gamifyDb.LearnerQuestions WHERE LearnerQuestions.questionId = ${questionId} AND LearnerQuestions.userId = ${userId} AND LearnerQuestions.completed = 0`
            );
            const data2 = raw2[0].map((item) => {
                return {
                    Time: item.time,
                    timeTaken: item.timeTaken,
                };
            });

            const time = data2[0].Time || 0;
            const diffTimeHrs = await utils.timeDifference(time);
            const timetaken = data2[0].timeTaken || 0;

            const newTime = parseFloat(timetaken) + parseFloat(diffTimeHrs);

            const sql3 = `UPDATE gamifyDb.LearnerQuestions SET LearnerQuestions.timeTaken = ?, LearnerQuestions.partialAnswer = ?, LearnerQuestions.dateCompleted = CURRENT_TIMESTAMP, LearnerQuestions.completed = 1 WHERE LearnerQuestions.questionId = ? AND LearnerQuestions.userId = ?`;

            const raw3 = await pool.query(sql3, [newTime, answer, questionId, userId]);

            const insertStudyLog = await insertTimeLearner(userId, newTime);

            const milestoneProgress = await assignments.getBadge(userId, questionId);

            const response = {
                progress: true,
                data: milestoneProgress,
            };

            res.write(`${JSON.stringify(response)}\n\n`);
        }
    } catch (err) {
        console.log(err);
        const error = {
            error: "Oh no! An error has occured when creating your feedback!",
        };
        return res.write(`${JSON.stringify(error)}\n\n`);
    } finally {
        res.end();
    }
}
