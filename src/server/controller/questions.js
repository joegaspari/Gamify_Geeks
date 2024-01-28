import * as q from "../data/questions.js";
import * as ans from "../data/answers.js";
import * as OpenAI from "../controller/generate.js";

export async function getQuestion(req, res) {
    try {
        const userId = req.userId;

        const { topicId, languageId, difficultyId } = req.body;
        // Input validation
        if (!topicId || !languageId || !difficultyId) {
            return res.status(400).json({ error: "All fields (topicId, languageId, difficultyId) are required." });
        }

        await q.question(topicId, difficultyId, languageId, userId, res);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to getQuestion" });
    }
}

export async function onSave(req, res) {
    try {
        const userId = req.userId;
        const Qid = req.body.id;
        const answer = req.body.answer;

        if (!userId || !Qid || !answer) {
            return res.status(400).json({ error: "All fields userId, QuestionId, answer) are required." });
        }

        const result = await ans.save(Qid, userId, answer);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to save partial answer" });
    }
}

export async function testGenerate(req, res) {
    try {
        const topic = req.body.topic;
        const lang = req.body.language;
        const dif = req.body.difficulty;
        if (!topic || !lang || !dif) {
            return res.status(400).json({ error: "All fields topic, language, difficulty) are required." });
        }
        const genQ = await OpenAI.generate(topic, lang, dif);
        res.status(200).json(genQ);
    } catch (err) {
        throw err;
    }
}
export async function test(req, res) {
    try {
        const userId = req.userId;
        const time = 1;
        const genQ = await ans.insertTimeLearner(userId, time);
        res.status(200).json(genQ);
    } catch (err) {
        throw err;
    }
}

export async function checkAnswer(req, res) {
    try {
        const userId = req.userId;
        const qId = req.body.id;
        const answer = req.body.answer;

        if (!userId || !qId || !answer) {
            return res.status(400).json({ error: "All fields userId, QuestionId, answer) are required." });
        }

        await ans.checkA(userId, qId, answer, res);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to check answer" });
    }
}

export async function hint(req, res) {
    try {
        const qId = req.body.qId;

        await q.hint(qId, res);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to getHint" });
    }
}

export async function report(req, res) {
    try {
        const userId = req.userId;
        const qId = req.body.qId;
        const result = await q.reportQ(qId, userId);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to report the Question" });
    }
}
