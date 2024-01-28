import * as assignments from "../data/assignments.js";

export async function createAssignments(req, res) {
    try {
        const moduleId = req.body.moduleId;
        const name = req.body.name;
        const topicId = req.body.topicId;
        const diffId = req.body.diffId;
        const langId = req.body.langId;
        const instructorId = req.userId;
        const numberQ = req.body.numberOfQuestions;
        const deadLine = req.body.deadline;
        if (!topicId || !langId || !diffId || !moduleId || !name || !instructorId || !numberQ || !deadLine) {
            return res.status(400).json({ error: "All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required." });
        }
        const date = `${deadLine}T00:00:000`;
        const result = await assignments.createAssignmentQuestions(moduleId, numberQ, name, topicId, diffId, langId, date, instructorId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create Assignment" });
    }
}
export async function changeVisibility(req, res) {
    console.log(req.body);
    try {
        const modId = req.body.moduleId;
        const assignmentId = req.body.assignmentId;

        if (!modId || !assignmentId) {
            return res.status(400).json({ error: "All fields (assignmentId, moduleId) are required." });
        }
        const result = await assignments.changeVis(modId, assignmentId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to change Assignment visibility" });
    }
}
export async function inactivateA(req, res) {
    try {
        const modId = req.query.moduleId;
        const assignmentId = req.query.assignmentId;

        if (!modId || !assignmentId) {
            return res.status(400).json({ error: "All fields (assignmentId, moduleId) are required." });
        }
        const result = await assignments.inactivateAssignment(modId, assignmentId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to change Assignment visibility" });
    }
}
export async function linkStudentAssignment(req, res) {
    try {
        const userId = req.userId;
        const assignmentId = req.body.assignmentId;
        const classId = req.body.classId;

        if (!userId || !assignmentId || !classId) {
            return res.status(400).json({ error: "All fields (assignmentId, userId, classId) are required." });
        }
        const result = await assignments.createStudentQuestions(userId, assignmentId, classId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to change link assignment questions" });
    }
}

export async function saveAssignmentQuestion(req, res) {
    try {
        const userId = req.userId;
        const questionId = req.body.questionId;
        const textContent = req.body.textContent;
        const aId = req.body.assignmentId;
        if (!userId || !questionId || !textContent || !aId) {
            return res.status(400).json({ error: "All fields (textContent, userId, questionId, assignmentId) are required." });
        }
        const result = await assignments.saveAssignmentQ(questionId, userId, textContent, aId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Failed to save assignment question: ${qId}` });
    }
}

export async function startQtime(req, res) {
    try {
        const userId = req.userId;
        const questionId = req.body.questionId;
        const aId = req.body.assignmentId;

        if (!userId || !questionId || !aId) {
            return res.status(400).json({ error: "All fields (userId, questionId, answerId) are required." });
        }
        const result = await assignments.startTimer(userId, questionId, aId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Failed to start assignment question timer: ${qId}` });
    }
}

export async function checkAssignmentAnswer(req, res) {
    try {
        const userId = req.userId;
        const qId = req.body.id;
        const answer = req.body.answer;
        const assignmentId = req.body.assignmentId;

        if (!userId || !qId || !answer || !assignmentId) {
            return res.status(400).json({ error: "All fields userId, QuestionId, answer) are required." });
        }

        await assignments.checkA(userId, qId, answer, assignmentId, res);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to check answer" });
    }
}

export async function editAssignments(req, res) {
    try {
        console.log(req.body);
        const assignmentId = req.body.assignmentId;
        const deadline = req.body.deadline;
        const name = req.body.name;
        if (!assignmentId || !deadline || !name) {
            return res.status(400).json({ error: "All fields assignmentId, dueDate, and newName are required." });
        }

        const result = await assignments.editAssignment(assignmentId, deadline, name);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to edit assignment" });
    }
}

export async function getStudentQs(req, res) {
    try {
        const assignmentId = req.body.assignmentId;
        const userId = req.userId;
        const classId = req.body.classId;
        if (!assignmentId || !userId || !classId) {
            return res.status(400).json({ error: "All fields assignmentId, userId, and classId are required." });
        }

        const result = await assignments.getStudentQs(userId, assignmentId, classId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get Student Q" });
    }
}

export async function getStudentStats(req, res) {
    try {
        const classId = req.body.classId;
        const search = req.body.search;
        if (!classId) {
            return res.status(400).json({ error: "classId is required." });
        }

        const result = await assignments.getStudentStats(classId, search || "");
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get Class analytics" });
    }
}

export async function upcomingAssignments(req, res) {
    try {
        const classId = req.body.classId;
        const userId = req.userId || req.body.studentId;

        if (!classId) {
            return res.status(400).json({ error: "classId is required" });
        }

        const upcoming = await assignments.getUpcomingAssignments(userId, classId);

        res.status(200).json(upcoming);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get Upcoming Assignments" });
    }
}
