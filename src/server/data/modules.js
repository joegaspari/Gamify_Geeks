import pool from "../connection/sqlconnect.js";
import { extractYearMonthDay } from "./topic.js";
import * as utils from '../Utils/utils.js';

export async function getClassModules(userId, classId) {
    try {
        if (classId == null) {
            throw "class Id is null";
        }
        const sql = `SELECT ClassStudent.userId AS LearnerId, Module.name, Module.moduleId
        FROM gamifyDb.ClassStudent 
        LEFT JOIN gamifyDb.Class ON ClassStudent.classId = Class.classId
        RIGHT JOIN gamifyDb.Module ON Class.classId = Module.classId
        WHERE ClassStudent.userId = ${userId} AND Class.classId = ${classId} AND Module.visible = 1 AND Module.active = 1 ORDER BY Module.created DESC`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return { name: item.name, modId: item.moduleId };
        });
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function getInstructorClassModules(userId, classId) {
    try {
        if (classId == null) {
            throw "class Id is null";
        }
        const sql = `SELECT Class.userId, Module.name, Module.moduleId, Module.visible, Module.status
        FROM gamifyDb.Class
        RIGHT JOIN gamifyDb.Module ON Class.classId = Module.classId
        WHERE Class.userId = ${userId} AND Class.classId = ${classId} AND Module.active = 1 ORDER BY Module.created DESC`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return { name: item.name, modId: item.moduleId, visible: item.visible, status: item.status };
        });
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function getInstructorClassModulesAssignments(userId, classId) {
    try {
        if (classId == null) {
            throw "class Id is null";
        }
        let modAssignments = [];
        const modules = await getInstructorClassModules(userId, classId);
        for (let i = 0; i < modules.length; i++) {
            const modId = modules[i].modId;
            const name = modules[i].name;
            const vis = modules[i].visible;
            const stat = modules[i].status;
            const sql2 = `SELECT Assignment.name AS assignment, Assignment.sampleQuestion, Assignment.assignmentId, Assignment.numberOfQuestions, Assignment.topicId AS topicID, Assignment.proficiencyLevelId, Assignment.programmingLanguageId, Topic.name AS Topic, ProgrammingLanguage.name AS Language, ProficiencyLevel.name AS difficulty, Assignment.deadlineDate, Assignment.status, Assignment.visible
            FROM gamifyDb.Assignment
            RIGHT JOIN gamifyDb.Topic ON Assignment.topicId = Topic.topicId
            RIGHT JOIN gamifyDb.ProgrammingLanguage ON Assignment.programmingLanguageId = ProgrammingLanguage.programmingLanguageId
            RIGHT JOIN gamifyDb.ProficiencyLevel ON Assignment.proficiencyLevelId = ProficiencyLevel.proficiencyLevelId
            WHERE Assignment.moduleId = ${modId} AND Assignment.active = 1 ORDER BY Assignment.createdOn DESC`;
            const raw = await pool.query(sql2);
            if (raw[0].length != 0) {
                const data2 = await raw[0].map((item) => {
                    const date = extractYearMonthDay(item.deadlineDate);
                    return {
                        id: item.assignmentId,
                        name: item.assignment,
                        numberOfQuestions: item.numberOfQuestions,
                        topic: item.Topic,
                        topicId: item.topicID,
                        difficulty: item.difficulty,
                        diffId: item.proficiencyLevelId,
                        language: item.Language,
                        langId: item.programmingLanguageId,
                        status: item.status,
                        deadline: date,
                        visible: item.visible,
                        sampleQuestion: item.sampleQuestion,
                    };
                });
                modAssignments.push({
                    id: modId,
                    title: name,
                    visible: vis,
                    status: stat,
                    assignments: data2,
                });
            } else {
                modAssignments.push({
                    id: modId,
                    title: name,
                    status: stat,
                    visible: vis,
                    assignments: [],
                });
            }
        }
        return modAssignments;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function getStudentAssignmentStatus(userId, assignmentId) {
    try {
        if (userId == null || userId == "undefined") {
            throw "user Id is null or undefined";
        }
        if (assignmentId == null || assignmentId == "undefind") {
            throw "user Id is null or undefined";
        }
        const sql = `SELECT StudentAssignmentQuestion.completed, StudentAssignmentQuestion.partialAnswer FROM gamifyDb.StudentAssignmentQuestion WHERE StudentAssignmentQuestion.userId = ${userId} AND StudentAssignmentQuestion.assignmentId = ${assignmentId}`;
        const raw = await pool.query(sql);
        const stat = utils.evaluateObjects(raw[0]);
        return stat
    } catch (err) {
        console.log(err);
        throw err;
    }
}

function checkModuleStatus(statusList) {
    try {
        if (statusList == null || statusList == "undefined") {
            throw "status List is null or undefined";
        }
        if (statusList.includes(3) && !statusList.includes(2) && !statusList.includes(1)) {
            return 3;
        } else if (statusList.includes(3) && statusList.includes(2)) {
            return 2;
        } else {
            return 1;
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getClassModulesAssignments(userId, classId) {
    try {
        if (classId == null) {
            throw "class Id is null";
        }
        let modAssignments = [];
        const modules = await getClassModules(userId, classId);
        for (let i = 0; i < modules.length; i++) {
            const modId = modules[i].modId;
            const name = modules[i].name;
            const sql2 = `SELECT Assignment.name AS assignment, Assignment.sampleQuestion, Assignment.assignmentId, Assignment.numberOfQuestions, Assignment.topicId AS topicID, Assignment.proficiencyLevelId, Assignment.programmingLanguageId, Topic.name AS Topic, ProgrammingLanguage.name AS Language, ProficiencyLevel.name AS difficulty, Assignment.deadlineDate, Assignment.status
            FROM gamifyDb.Assignment
            RIGHT JOIN gamifyDb.Topic ON Assignment.topicId = Topic.topicId
            RIGHT JOIN gamifyDb.ProgrammingLanguage ON Assignment.programmingLanguageId = ProgrammingLanguage.programmingLanguageId
            RIGHT JOIN gamifyDb.ProficiencyLevel ON Assignment.proficiencyLevelId = ProficiencyLevel.proficiencyLevelId
            WHERE Assignment.moduleId = ${modId} AND Assignment.active = 1 AND Assignment.visible = 1 ORDER BY Assignment.createdOn DESC`;

            const raw = await pool.query(sql2);

            if (raw[0].length != 0) {
                let statusList = [];
                let data2 = [];

                for (let i = 0; i < raw[0].length; i++) {
                    let item = raw[0][i];

                    if (!item) {
                        continue;
                    }

                    const date = extractYearMonthDay(item.deadlineDate);
                    const aStatus = await getStudentAssignmentStatus(userId, item.assignmentId);
                    console.log(aStatus);
                    statusList.push(aStatus);

                    data2.push({
                        id: item.assignmentId,
                        name: item.assignment,
                        numberOfQuestions: item.numberOfQuestions,
                        topic: item.Topic,
                        topicId: item.topicID,
                        difficulty: item.difficulty,
                        diffId: item.proficiencyLevelId,
                        language: item.Language,
                        langId: item.programmingLanguageId,
                        status: aStatus,
                        deadline: date,
                        sampleQuestion: item.sampleQuestion,
                    });
                }

                const modStatus = checkModuleStatus(statusList);
                modAssignments.push({
                    id: modId,
                    title: name,
                    status: modStatus,
                    assignments: data2,
                });
            } else {
                modAssignments.push({
                    id: modId,
                    title: name,
                    status: 1,
                    assignments: [],
                });
            }
        }
        return modAssignments;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createModule(name, classId) {
    try {
        if (name == null || name == "undefined") {
            throw "Name is null or undefined";
        }
        if (classId == null || classId == "undefined") {
            throw "Class Id is null or undefined";
        }

        const sql = `INSERT INTO gamifyDb.Module(classId, name) VALUES (${classId}, "${name}")`;
        const raw = await pool.query(sql);

        const data = raw[0].insertId;
        return {
            moduleId: data,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function changeVis(moduleId, classId) {
    if (moduleId == null || moduleId == "undefined") {
        throw "moduleId is null or undefined";
    }
    if (classId == null || classId == "undefined") {
        throw "classId is null or undefined";
    }
    const sql = `UPDATE gamifyDb.Module SET Module.visible = NOT(Module.visible) WHERE Module.classId = ${classId} AND Module.moduleId = ${moduleId}`;
    const raw = await pool.query(sql);
    if (raw[0].changedRows == 0) {
        throw "Module was unable to change visiblity";
    }
    return {
        response: "Module visibility changed",
    };
}

export async function inactivateModule(moduleId, classId) {
    if (moduleId == null || moduleId == "undefined") {
        throw new Error("moduleId is null or undefined");
    }
    if (classId == null || classId == "undefined") {
        throw new Error("classId is null or undefined");
    }
    try {
        const sql = `UPDATE gamifyDb.Module SET Module.active = 0 WHERE Module.classId = ${classId} AND Module.moduleId = ${moduleId}`;
        const raw = await pool.query(sql);

        if (raw.changedRows == 0) {
            throw new Error("Module was unable to delete");
        }

        return {
            response: "Module deleted",
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}
