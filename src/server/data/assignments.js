import pool from "../connection/sqlconnect.js";
import { generate, generateUniqueQuestion, generateHint } from "../controller/generate.js";
import { getCosSims } from "../Utils/cosSim.js";
import * as q from "../data/questions.js";
import * as utils from "../Utils/utils.js";

import { generateFeedback } from "../controller/generate.js";
import StudentAssignmentQuestion from "../models/studentAssignmentQuestion.js";
import Assignment from "../models/assignment.js";
import AssignmentQuestion from "../models/assignmentQuestion.js";
import Topic from "../models/topic.js";
import { Sequelize } from "sequelize";

async function checkAssignment(moduleId, name, topicId, diffId, langId, userId) {
    try {
        const sql = `SELECT Assignment.assignmentId, Assignment.sampleQuestion
        FROM gamifyDb.Class
        RIGHT JOIN gamifyDb.Module ON Class.classId = Module.classId
        RIGHT JOIN gamifyDb.Assignment ON Module.moduleId = Assignment.moduleId
        WHERE Assignment.moduleId = ${moduleId}
        AND Class.userId = ${userId}
        AND Assignment.name = "${name}" 
        AND Assignment.topicId = ${topicId} 
        AND Assignment.proficiencyLevelId = ${diffId} 
        AND Assignment.programmingLanguageId = ${langId}
        AND Assignment.active = 1`;
        const raw = await pool.query(sql);
        if (raw[0][0] == null || raw[0][0] == "undefined") {
            return null;
        } else {
            return {
                id: raw[0][0].assignmentId,
                sampleQuestion: raw[0][0].sampleQuestion,
            };
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function prompts(topicId, diffId, langId) {
    try {
        // first check prompt existence
        let promptID = await q.checkPrompt(topicId, diffId, langId);
        if (promptID.length == 0) {
            //2.) We need to add the new prompt into the table
            //If the prompt id array returned by checkPrompt is of length 0 then there is no matching prompt ID therefore we need to create one
            let createPromptID = await q.createPrompt(topicId, diffId, langId);
            //Here set the promptID to the created ID to be used later
            promptID = createPromptID[0];
        } else {
            //Else we set the prompt id found in the check to the promptID var
            promptID = promptID[0];
        }
        return promptID;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function getAssingmentQfromPrompt(topicId, langId, diffId, userId) {
    try {
        if (topicId == null || topicId == "undefined") {
            throw "topic Id is null or undefined";
        }
        if (diffId == null || diffId == "undefined") {
            throw "difficulty Id is null or undefined";
        }
        if (langId == null || langId == "undefined") {
            throw "language Id is null or undefined";
        }
        if (userId == null || userId == "undefined") {
            throw "User Id is null or undefined";
        }
        // This statement will query the DB for all assignment questions created that fit the prompt arguments, the statement should filter the set by
        // questions the instructor hasnt seen
        const sql = `SELECT Question.textContent, Question.questionId
        FROM gamifyDb.Class
        RIGHT JOIN gamifyDb.Module ON Class.classId = Module.classId
        RIGHT JOIN gamifyDb.Assignment ON Module.moduleId = Assignment.moduleId 
        RIGHT JOIN gamifyDb.AssignmentQuestion ON Assignment.assignmentId = AssignmentQuestion.assignmentId
        LEFT JOIN gamifyDb.Question ON AssignmentQuestion.questionId = Question.questionId
        LEFT JOIN gamifyDb.QuestionPrompt ON Question.questionPromptId = QuestionPrompt.questionPromptId
        WHERE QuestionPrompt.topicId = ${topicId} AND QuestionPrompt.programmingLanguageId = ${langId} AND QuestionPrompt.proficiencyLevelId = ${diffId} AND Question.active = 1 AND Question.assignment = 1 AND NOT Class.userId = ${userId}`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return { id: item.questionId, textContent: item.textContent };
        });
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
async function insertAssignmentQuestion(assignmentId, questionId) {
    try {
        if (assignmentId == null || assignmentId == "undefined") {
            throw "assignment Id is null or undefined";
        }
        if (questionId == null || questionId == "undefined") {
            throw "question Id is null or undefined";
        }
        const sql = `INSERT INTO gamifyDb.AssignmentQuestion(assignmentId, questionId) VALUES (${assignmentId}, ${questionId})`;
        const raw = await pool.query(sql);
        if (raw[0].length == 0 || raw[0].insertId == "undefined" || raw[0].insertId == null) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function testInsertQuestion(qList, assignmentId) {
    try {
        let checkInsert = [];
        for (let i = 0; i < qList.length; i++) {
            const qId = qList[i].id;
            const inserted = await insertAssignmentQuestion(assignmentId, qId);
            // insertAssignmentQuestion will return true if the assignment was linked to the question or false if it failed
            // append this bool to the list check insert
            console.log(inserted);
            checkInsert.push(inserted);
        }
        const testInsert = checkInsert.includes(false);
        return testInsert;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function updateAssignment(assignmentId, textContent) {
    try {
        if (assignmentId == null || assignmentId == "undefined") {
            throw "assignment Id is null or undefined";
        }
        if (textContent == null || textContent == "undefined") {
            throw "question Id is null or undefined";
        }
        const sql = `UPDATE gamifyDb.Assignment SET Assignment.sampleQuestion = ? WHERE Assignment.assignmentId = ?`;
        const raw = await pool.query(sql, [textContent, assignmentId]);
        if (raw[0].length == 0 || raw[0] == "undefined" || raw[0] == null) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function createAssignmentQuestions(moduleId, numberQ, name, topicId, diffId, langId, deadline, userId) {
    try {
        // The Logic for this type of question generation is quite ardous
        // So since a prof/instructor can generate a set of questions before there are even students in
        // the class, we must generate questions free from the users, and then link those users upon clicking into a assignment
        if (moduleId == null || moduleId == "undefined") {
            throw "Module Id is null or undefined @ data/assignments/createAssignmentQuestions";
        }
        if (numberQ == null || numberQ == "undefined") {
            throw "The number of questions is null or undefined @ data/assignments/createAssignmentQuestions";
        }
        if (name == null || name == "undefined") {
            throw "the assignment name has not been included @ data/assignments/createAssignmentQuestions";
        }
        if (diffId == null || diffId == "undefined") {
            throw "difficulty Id is null or undefined @ data/assignments/createAssignmentQuestions";
        }
        if (topicId == null || topicId == "undefined") {
            throw "topicId is null or undefined @ data/assignments/createAssignmentQuestions";
        }
        if (langId == null || langId == "undefined") {
            throw "language Id is null or undefined @ data/assignments/createAssignmentQuestions";
        }
        if (deadline == null || deadline == "undefined") {
            throw "deadline date is null or undefined @ data/assignments/createAssignmentQuestions";
        }
        if (userId == null || userId == "undefined") {
            throw "user ID is null or undefined @ data/assignments/createAssignmentQuestions";
        }

        //If checkAssignments returns null which will happen if there are no assignments that match the arguments found in the call
        const checkAssignments = await checkAssignment(moduleId, name, topicId, diffId, langId, userId);
        if (checkAssignments == null) {
            const sql = `INSERT INTO gamifyDb.Assignment(moduleId, numberOfQuestions, name, topicId, proficiencyLevelId, programmingLanguageId, createdOn, deadlineDate, status) VALUES (${moduleId}, ${numberQ}, "${name}", ${topicId}, ${diffId}, ${langId}, curdate(), "${deadline}", 1)`;
            const raw = await pool.query(sql);
            const assignmentId = raw[0].insertId;
            const promptID = await prompts(topicId, diffId, langId);

            // Now grab a list of questions that exist within the DB that follow the same prompt structure that the instructor has not seen
            const qList = await getAssingmentQfromPrompt(topicId, langId, diffId, userId);
            // if this is a list of 10 or greater then we can assume that the prof hasnt created this set before
            // as soon as these questions are linked to the assignment question table they are then linked to the instructor and will not appear again

            if (qList.length >= numberQ) {
                // So if the list of question in the DB (that the prof has never seen) is greater in length then the number of questions needed
                // for the assignment then we just take those questions and link them to the assignment
                // for each question in the list add new entry to AssignmentQuestion
                const testInsert = await testInsertQuestion(qList, assignmentId);
                if (testInsert) {
                    throw "issue inserting questions into assignment question";
                }
                const sample = await updateAssignment(assignmentId, generateQ);
                console.log(sample);

                return {
                    id: assignmentId,
                    sampleQuestion: qList[0].textContent,
                };
            } else {
                const topic = await q.getTopic(topicId);
                const lang = await q.getLanguages(langId);
                const diff = await q.getDifficulty(diffId);
                // Else the number is less, if the number is less then we take numberOfQ - qList.length to get the number of questions that will need to be generate
                const newNumberOfQ = numberQ - qList.length;
                // Here we just are extracting the textContent of each question into a list of its own
                // We need this list of questions to test cosSimilarity, this qListAdd will grow up untill it has reached the number of questions
                // required for the assignment
                let insertList = qList;
                for (let i = 0; i < newNumberOfQ; i++) {
                    const textContent = insertList.map((item) => {
                        return item.textContent;
                    });

                    let qListAdd = textContent;
                    // Here we will create a question
                    // We need to loop
                    var generateQ;
                    let check = true;
                    while (check == true) {
                        generateQ = await generate(topic, lang, diff);
                        // 3.c) We need to check if the quesiton generated has the same text content
                        if (generateQ == null || generateQ.length <= 1) {
                            throw "generateQ is returning null or a blank string : data/assignments line 171";
                        }
                        check = getCosSims(qListAdd, generateQ);
                        // console.log(generateQ);
                        console.log("question regenerated");
                    }
                    console.log("new question was generated: data/assignments");

                    // So now a new question has been generated and is different then the set of questions that is currenly found in the database
                    const qId = await q.createQuestion(generateQ, 100, promptID, 1);
                    insertList.push({
                        id: qId,
                        textContent: generateQ,
                    });
                }
                // We need to update the assignment with a sample question
                const sample = await updateAssignment(assignmentId, generateQ);
                console.log(sample);
                const testInsert = await testInsertQuestion(insertList, assignmentId);
                if (testInsert) {
                    throw "issue inserting questions into assignment question";
                }
                return {
                    id: assignmentId,
                    sampleQuestion: generateQ,
                };
            }
        }
        // Otherwise checkAssignments returns the assignmnet ID back to the front end for a message
        return {
            id: checkAssignments.id,
            sampleQuestion: checkAssignments.sampleQuestion,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export async function editAssignment(assignmentId, dueDate, newName) {
    try {
        if (assignmentId == null || assignmentId == "undefined") {
            throw "assignmentId is null or undefined";
        }
        if (dueDate == null || dueDate == "undefined") {
            throw "dueDate is null or undefined";
        }
        if (newName == null || newName == "undefined") {
            throw "newNameis null or undefined";
        }
        // Essentially the only two fields that we will allow a user to edit when it comes to an assignment is the duedate and the title
        // First grab the assignment that corresponds to the assignmentI
        // Essentially the only two fields that we will allow a user to edit when it comes to an assignment is the duedate and the title
        // First grab the assignment that corresponds to the assignmentId
        const raw = await pool.query(
            `SELECT Assignment.name, Assignment.deadlineDate FROM gamifyDb.Assignment WHERE Assignment.assignmentId = ${assignmentId}`
        );

        if ((raw[0].length = 0)) {
            return { error: "Assignment Id does not exist" };
        }

        const data = raw[0][0];

        const date = data.deadlineDate;
        const sameD = sameDay(date, new Date(dueDate)) ? date : new Date(dueDate);
        const sameS = newName.toLowerCase() == data.name.toLowerCase() ? data.name : newName;

        const update = await pool.query(`UPDATE gamifyDb.Assignment SET Assignment.deadlineDate = ?, Assignment.name = ? WHERE Assignment.assignmentId = ?`, [
            sameD,
            sameS,
            assignmentId,
        ]);

        // Random Comment
        return update[0];
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

export async function changeVis(moduleId, assignmentId) {
    if (moduleId == null || moduleId == "undefined") {
        throw "moduleId is null or undefined";
    }
    if (assignmentId == null || assignmentId == "undefined") {
        throw "assignmentId is null or undefined";
    }
    const sql = `UPDATE gamifyDb.Assignment SET Assignment.visible = NOT(Assignment.visible) WHERE Assignment.moduleId = ${moduleId} AND Assignment.assignmentId = ${assignmentId}`;
    const raw = await pool.query(sql);
    if (raw[0].changedRows == 0) {
        throw "Assignment was unable to change visiblity";
    }
    return {
        response: "Assignment visibility changed",
    };
}
export async function inactivateAssignment(moduleId, assignmentId) {
    try {
        if (moduleId == null || moduleId == "undefined") {
            throw "moduleId is null or undefined";
        }
        if (assignmentId == null || assignmentId == "undefined") {
            throw "classId is null or undefined";
        }
        const sql = `UPDATE gamifyDb.Assignment SET Assignment.active = 0 WHERE Assignment.moduleId = ${moduleId} AND Assignment.assignmentId = ${assignmentId}`;
        const raw = await pool.query(sql);
        if (raw.changedRows == 0) {
            throw "Assignment was unable to delete";
        }
        return {
            response: "Assignment deleted",
        };
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
async function checkStudentAssignment(userId, assignmentId) {
    try {
        if (userId == null || userId == "undefined") {
            throw "userId is null or undefined";
        }
        if (assignmentId == null || assignmentId == "undefined") {
            throw "assignmentId is null or undefined";
        }
        const sql = `SELECT StudentAssignmentQuestion.userId, StudentAssignmentQuestion.assignmentId FROM gamifyDb.StudentAssignmentQuestion WHERE  StudentAssignmentQuestion.userId = ${userId} AND StudentAssignmentQuestion.assignmentId = ${assignmentId}`;
        const raw = await pool.query(sql);
        if (raw[0].length == 0) {
            return false;
        }
        return true;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
async function getassignmentQuestions(assignmentId) {
    try {
        if (assignmentId == null || assignmentId == "undefined") {
            throw "assignmentId is null or undefined";
        }
        const sql = `SELECT * FROM gamifyDb.AssignmentQuestion
        LEFT JOIN gamifyDb.Question ON AssignmentQuestion.questionId = Question.questionId WHERE AssignmentQuestion.assignmentId = ${assignmentId}`;
        const raw = await pool.query(sql);
        if (raw[0].length == 0) {
            throw "no assignment questions exist";
        }
        const data = raw[0].map((item) => {
            return {
                qId: item.questionId,
                textContent: item.textContent,
            };
        });
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
async function linkStudentQuestion(userId, assignmentId, classId, questionId) {
    try {
        if (assignmentId == null || assignmentId == "undefined") {
            throw "assignmentId is null or undefined";
        }
        if (userId == null || userId == "undefined") {
            throw "userId is null or undefined";
        }
        if (classId == null || classId == "undefined") {
            throw "classId is null or undefined";
        }
        if (questionId == null || questionId == "undefined") {
            throw "questionId is null or undefined";
        }
        const sql = `INSERT INTO gamifyDb.StudentAssignmentQuestion(userId, classId, assignmentId, questionId) VALUES (?, ?, ?, ?)`;
        const raw = await pool.query(sql, [userId, classId, assignmentId, questionId]);
        if (raw[0].affectedRows != 1) {
            throw "question not inserted";
        }
        return true;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

function checkQuestionStatus(partialA, completed) {
    try {
        if (partialA.length > 1 && completed == 1) {
            return 3;
        } else if (partialA.length > 1 && completed == 0) {
            return 2;
        } else {
            return 1;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function getStudentQs(userId, assignmentId, classId) {
    try {
        if (assignmentId == null || assignmentId == "undefined") {
            throw "assignmentId is null or undefined";
        }
        if (userId == null || userId == "undefined") {
            throw "userId is null or undefined";
        }
        if (classId == null || classId == "undefined") {
            throw "classId is null or undefined";
        }

        const sql = `SELECT StudentAssignmentQuestion.assignmentId, StudentAssignmentQuestion.questionId, StudentAssignmentQuestion.partialAnswer, StudentAssignmentQuestion.completed, Question.textContent FROM gamifyDb.StudentAssignmentQuestion
        LEFT JOIN gamifyDb.Question ON StudentAssignmentQuestion.questionId = Question.questionId WHERE StudentAssignmentQuestion.assignmentId = ? AND StudentAssignmentQuestion.userId = ? AND StudentAssignmentQuestion.classId = ?`;
        const raw = await pool.query(sql, [assignmentId, userId, classId]);
        if (raw[0].length == 0) {
            throw "no student questions exist";
        }
        const data = raw[0].map((item) => {
            const status = checkQuestionStatus(item.partialAnswer == null ? "" : item.partialAnswer, item.completed);
            return {
                id: item.questionId,
                textContent: item.textContent,
                partialAnswer: item.partialAnswer,
                completed: item.completed,
                status: status,
            };
        });
        return data;
    } catch (err) {
        console.log(err);
        throw { error: err };
    }
}

export async function getStudents(classId) {
    try {
        if (classId == null || classId == "undefined") {
            throw "classId is null or undefined";
        }
        const sql = `SELECT ClassStudent.userId, Users.username FROM gamifyDb.ClassStudent LEFT JOIN gamifyDb.Users ON ClassStudent.userId = Users.userId WHERE ClassStudent.classId = ?`;
        const raw = await pool.query(sql, [classId]);
        if (raw[0].length == 0) {
            throw "no students exist in class";
        }
        const data = raw[0].map((item) => {
            return {
                userId: item.userId,
                name: item.username,
            };
        });
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

export async function getStudentStats(classId, search) {
    try {
        if (classId == null || classId == "undefined") {
            throw "classId is null or undefined";
        }
        const result = [];
        const students = await getStudents(classId);

        for (let i = 0; i < students.length; i++) {
            const userId = students[i].userId;
            const username = students[i].name;
            const sql = `SELECT Users.username, StudentAssignmentQuestion.assignmentId, StudentAssignmentQuestion.questionId, StudentAssignmentQuestion.partialAnswer, StudentAssignmentQuestion.completed, StudentAssignmentQuestion.timeTaken, Question.textContent 
            FROM gamifyDb.StudentAssignmentQuestion
            LEFT JOIN gamifyDb.Question ON StudentAssignmentQuestion.questionId = Question.questionId 
            LEFT JOIN gamifyDb.Users ON StudentAssignmentQuestion.userId = Users.userId 
            WHERE StudentAssignmentQuestion.classId = ? AND StudentAssignmentQuestion.userId = ? AND Users.username LIKE "%?%"`;
            const raw = await pool.query(sql, [classId, userId, search]);
            if (raw[0].length == 0) {
                const res = {
                    id: userId,
                    name: username,
                    completed: 0,
                    attempted: 0,
                    unAttempted: 100,
                    studyTime: 0,
                };
                result.push(res);
                break;
            }
            let noStart = 0;
            let inProg = 0;
            let comp = 0;
            let time = 0.0;
            let name;

            const status = raw[0].map((item) => {
                name = item.username;
                const state = checkQuestionStatus(item.partialAnswer == null ? "" : item.partialAnswer, item.completed);
                if (state == 3) {
                    comp += 1;
                } else if (state == 2) {
                    inProg += 1;
                } else {
                    noStart += 1;
                }
                time += item.timeTaken == null ? 0.0 : parseFloat(item.timeTaken);
                return state;
            });

            const res = {
                id: userId,
                name: name,
                completed: status.length == 0 ? 0 : Math.round((Number(comp) / Number(status.length)) * 100),
                attempted: status.length == 0 ? 0 :Math.round((Number(inProg) / Number(status.length)) * 100),
                unAttempted: status.length == 0 ? 100 : Math.round((Number(noStart) / Number(status.length)) * 100),
                studyTime: time.toFixed(2) + " hours",
            };
            result.push(res);
        }
        return result;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
//We need a function that grabs
export async function createStudentQuestions(userId, assignmentId, classId) {
    try {
        //First lets check that the student has been linked to an assignment
        //If they have return the list of question
        const assignmentExists = await checkStudentAssignment(userId, assignmentId);
        let assignmentQuestions = await getassignmentQuestions(assignmentId);
        if (!assignmentExists) {
            let t = [];
            for (let i = 0; i < assignmentQuestions.length; i++) {
                const linkStudentQ = await linkStudentQuestion(userId, assignmentId, classId, assignmentQuestions[i].qId);
                t.push(linkStudentQ);
            }
            if (t.includes(false)) {
                throw "not all questions inserted";
            }
            const listQ = await getStudentQs(userId, assignmentId, classId);
            return listQ;
        } else {
            // Here we need to get a list of questions that belong to the assignment Id
            const listQ = await getStudentQs(userId, assignmentId, classId);
            return listQ;
        }
    } catch (err) {
        console.log(err);

        return { error: err };
    }
}

export async function checkUserStudyDate(userId) {
    try {
        //This function will query the Assignment Student Study Log table and if the table contains a user id and date it will return the data to insertTime Learner
        const sql = `SELECT AssignmentStudyLog.studyDate, AssignmentStudyLog.studyHours FROM gamifyDb.AssignmentStudyLog WHERE AssignmentStudyLog.userId = ${userId} AND AssignmentStudyLog.studyDate = curdate()`;
        const raw = await pool.query(sql);
        const data = raw[0].length == 0 ? null : { studydate: raw[0][0].studyDate, studyhour: raw[0][0].studyHours };

        return data;
    } catch (err) {
        return err;
    }
}
export async function insertTimeLearner(userId, time, assignmentId) {
    try {
        // first convert the time stamp into a date
        const checkData = await checkUserStudyDate(userId);
        if (checkData != null) {
            // //Else we now update the row that currently exists
            const studyHours = parseFloat(checkData.studyhour) + parseFloat(time);
            const sql = `UPDATE gamifyDb.AssignmentStudyLog SET AssignmentStudyLog.studyHours = ${studyHours}, AssignmentStudyLog.assignmentId = ${assignmentId} WHERE AssignmentStudyLog.studyDate = curdate() AND AssignmentStudyLog.userId = ${userId}`;
            const raw = await pool.query(sql);

            return raw[0];
        } else {
            const sql = `INSERT INTO gamifyDb.AssignmentStudyLog(userId, studyDate, studyHours, assignmentId) VALUES (${userId}, curdate(), ${time}, ${assignmentId})`;
            const raw = await pool.query(sql);

            if (raw[0][0].affectedRows != 1) {
                return false;
            }
            return true;
        }
    } catch (err) {
        console.log(err);
        return { error: "Failed to insert time into AssignmentStudyLog." };
    }
}

export async function saveAssignmentQ(questionId, userId, textContent, assignmentId) {
    try {
        // On Save We want to take the current time stamp from the associated
        // LearnerQuestion, we want to then subtract the time and return the difference

        // 1.) Get the learnerQuestion LOG
        const raw = await pool.query(
            `SELECT StudentAssignmentQuestion.dateCreated AS dateCreated, StudentAssignmentQuestion.timeTaken FROM gamifyDb.StudentAssignmentQuestion WHERE StudentAssignmentQuestion.questionId = ${questionId} AND StudentAssignmentQuestion.userId = ${userId} AND StudentAssignmentQuestion.completed = 0 AND StudentAssignmentQuestion.assignmentId = ${assignmentId}`
        );
        if (raw[0].length == 0) {
            throw "No question available";
        }
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
        const insertTimeLearners = await insertTimeLearner(userId, tofloat, assignmentId);
        console.log(insertTimeLearners);
        if (!insertTimeLearners) {
            throw "Time was not inserted into learner Study logs";
        }

        const newTime = parseFloat(timetaken) + parseFloat(diffTimeHrs);
        // TODO: Change TEMP back to newTime (Changed it as newTime was NaN - Ramos)
        const raw2 = await pool.query(
            `UPDATE gamifyDb.StudentAssignmentQuestion SET StudentAssignmentQuestion.timeTaken = ${newTime}, StudentAssignmentQuestion.partialAnswer = "${textContent}", StudentAssignmentQuestion.dateCreated = CURRENT_TIMESTAMP WHERE StudentAssignmentQuestion.questionId = ${questionId} AND StudentAssignmentQuestion.userId = ${userId} AND StudentAssignmentQuestion.assignmentId = ${assignmentId}`
        );
        return raw2[0];
        // We want to store partial text content
    } catch (err) {
        console.log(err);
        return { error: "Failed to Save Answer Content" };
    }
}

export async function startTimer(userId, questionId, assignmentId) {
    try {
        // SINCE dateCreated is the time stamp when the set of questions was generated we need a new time stamp to be inserted when the student clicks into a question
        if (questionId == null || questionId == "undefined") {
            throw "Question Id is null or undefined";
        }
        if (userId == null || userId == "undefined") {
            throw "user Id is null or undefined";
        }
        const sql = `UPDATE gamifyDb.StudentAssignmentQuestion SET StudentAssignmentQuestion.dateCreated = CURRENT_TIMESTAMP WHERE StudentAssignmentQuestion.userId = ${userId} AND StudentAssignmentQuestion.questionId = ${questionId} AND StudentAssignmentQuestion.assignmentId = ${assignmentId}`;
        const raw = await pool.query(sql);
        if (raw[0].length == 0) {
            return false;
        }
        return true;
    } catch (err) {
        console.log(err);
        return { error: "Time did not updated" };
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
        return raw[0];
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

export async function checkA(userId, questionId, answer, assignmentId, res) {
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
                `SELECT StudentAssignmentQuestion.dateCreated, StudentAssignmentQuestion.timeTaken FROM gamifyDb.StudentAssignmentQuestion WHERE StudentAssignmentQuestion.questionId = ${questionId} AND StudentAssignmentQuestion.userId = ${userId} AND StudentAssignmentQuestion.completed = 0 AND StudentAssignmentQuestion.assignmentId = ${assignmentId}`
            );
            if (raw2[0].length == 0) {
                throw "Assignment Question has been marked";
            }
            const data2 = raw2[0].map((item) => {
                return {
                    Time: item.dateCreated,
                    timeTaken: item.timeTaken,
                };
            });

            const time = data2[0].Time;
            const diffTimeHrs = await utils.timeDifference(time);
            const timetaken = data2[0].timeTaken || 0.0;

            const newTime = parseFloat(timetaken) + parseFloat(diffTimeHrs);

            const sql3 = `UPDATE gamifyDb.StudentAssignmentQuestion SET StudentAssignmentQuestion.timeTaken = ?, StudentAssignmentQuestion.partialAnswer = ?, StudentAssignmentQuestion.dateCompleted = CURRENT_TIMESTAMP, StudentAssignmentQuestion.completed = 1 WHERE StudentAssignmentQuestion.questionId = ? AND StudentAssignmentQuestion.userId = ? AND StudentAssignmentQuestion.assignmentId = ?`;

            const raw3 = await pool.query(sql3, [newTime, answer, questionId, userId, assignmentId]);

            const currentDate = utils.getCurrentDate();

            const insertStudyLog = await insertTimeLearner(userId, newTime, assignmentId);

            const milestoneProgress = await getBadge(userId, questionId);

            const response = {
                progress: true,
                data: milestoneProgress,
            };
            res.write(`${JSON.stringify(response)}\n\n`);
        }
    } catch (err) {
        console.log(err);
        const error = {
            repeat: true,
            error: "Oh no! An error has occured when creating your feedback!",
        };
        return res.write(`${JSON.stringify(error)}\n\n`);
    } finally {
        res.end();
    }
}

export async function getUpcomingAssignments(userId, classId) {
    const sql = `
      SELECT 
        saq.assignmentId AS id,
        a.name AS title,
        COUNT(saq.questionId) AS progress,
        a.numberOfQuestions AS objective,
        a.programmingLanguageId AS programmingLanguageId,
        a.topicId AS topicId,
        a.proficiencyLevelId AS proficiencyLevelId,
        pl.iconpath AS iconPath,
        pl.iconpath AS badgePath
      FROM StudentAssignmentQuestion saq
      JOIN AssignmentQuestion aq ON saq.assignmentId = aq.assignmentId AND saq.questionId = aq.questionId
      JOIN Assignment a ON aq.assignmentId = a.assignmentId
      JOIN ProgrammingLanguage pl ON a.programmingLanguageId = pl.programmingLanguageId
      WHERE saq.userId = ? AND saq.classId = ? AND saq.completed = 1
      GROUP BY saq.assignmentId
      HAVING COUNT(saq.questionId) > 0 AND COUNT(saq.questionId) < objective
      LIMIT 6
    `;

    const [results] = await pool.execute(sql, [userId, classId]);

    return results;
}

export async function flipBit() {
    const raw3 = await pool.query(
        `UPDATE gamifyDb.StudentAssignmentQuestion SET  StudentAssignmentQuestion.completed = 0 WHERE StudentAssignmentQuestion.questionId = 29 AND StudentAssignmentQuestion.userId = 1`
    );
    return "flipped";
}
