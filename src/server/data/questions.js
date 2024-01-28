import pool from "../connection/sqlconnect.js";
import { generateUniqueQuestion, generateHint } from "../controller/generate.js";
import { getCosSims } from "../Utils/cosSim.js";
import openaiClient from "../connection/openai.js";
import * as Utils from "../Utils/utils.js";

export async function getLanguages(ID) {
    var err = "Failed to get Programming Languages";
    try {
        if (ID == null) {
            throw "Id is null";
        }
        const raw = await pool.query(
            `SELECT ProgrammingLanguage.name AS Language, ProgrammingLanguage.programmingLanguageId AS Id FROM gamifyDb.ProgrammingLanguage WHERE ProgrammingLanguage.programmingLanguageId = ${ID}`
        );
        const data = raw[0].map((item) => {
            return {
                Id: item.Id,
                Language: item.Language,
            };
        });
        return data[0].Language;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function getDifficulty(ID) {
    var err = "Failed to get Difficulties";
    try {
        if (ID == null) {
            throw "Id is null";
        }
        const raw = await pool.query(
            `SELECT ProficiencyLevel.name AS Difficulty, ProficiencyLevel.proficiencyLevelId AS Id FROM gamifyDb.ProficiencyLevel WHERE ProficiencyLevel.proficiencyLevelId = ${ID}`
        );
        const data = raw[0].map((item, index) => {
            return {
                Id: item.Id,
                Difficulty: item.Difficulty,
            };
        });
        return data[0].Difficulty;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function getTopic(ID) {
    var err = "Failed to get Difficulties";
    try {
        if (ID == null) {
            throw "Id is null";
        }
        const raw = await pool.query(`SELECT Topic.name AS Topic FROM gamifyDb.Topic WHERE Topic.topicId = ${ID}`);
        const data = raw[0].map((item, index) => {
            return {
                Id: item.Id,
                Topic: item.Topic,
            };
        });
        return data[0].Topic;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

// We Connect Learner to LearnerQuestions b/c We want to use the UserId to check if the user has created a question with this same prompt before, if they have created a question with the same prompt
// then we need to check if they have completed that question, if they have created a question then we want to check if that question is completed (filter for completed), select uncompleted one if one exists,
// if none exist (ie they never generated one before or they have completed all of them (no attempts)) then generate question with prompt values, link prompt ID to new question being added to the system

//************************
// We will need to figure out how to check db against questions users have already recieved as to then not have to get openAI to generate a new question
//Step 1 We need to check if the user has created any questions with the same prompt so we need a function that will take in the prompt values, the user ID
export async function checkOverLap(topicId, diffId, langId, userId) {
    //This function will be used to check if there exists a question in the current database that meets the same prompt requirement, we will have to check text content to see
    //First get the list of question ID's that the user has completed that match the prompt attributes
    try {
        if (userId == null || userId == "undefined") {
            throw "User Id is null or undefined";
        }
        if (topicId == null || topicId == "undefined") {
            throw "topic Id is null or undefined";
        }
        if (diffId == null || diffId == "undefined") {
            throw "difficulty Id is null or undefined";
        }
        if (langId == null || langId == "undefined") {
            throw "language Id is null or undefined";
        }
        const sql = `SELECT LearnerQuestions.questionId
        FROM gamifyDb.Learner 
        RIGHT JOIN gamifyDb.LearnerQuestions ON Learner.userId = LearnerQuestions.userId 
        LEFT JOIN gamifyDb.Question ON LearnerQuestions.questionId = Question.questionId 
        LEFT JOIN gamifyDb.QuestionPrompt ON Question.questionPromptId = QuestionPrompt.questionPromptId 
        WHERE Learner.userId = ${userId} AND QuestionPrompt.topicId = ${topicId} AND QuestionPrompt.programmingLanguageId = ${langId} AND QuestionPrompt.proficiencyLevelId = ${diffId} AND LearnerQuestions.completed = 1 AND Question.active = 1 AND Question.assignment = 0`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return item.questionId;
        });
        //Check if the database has a question of the same prompt attributes not related to the user
        const sql2 = `SELECT Question.questionId
        FROM gamifyDb.Question 
        LEFT JOIN gamifyDb.QuestionPrompt ON Question.questionPromptId = QuestionPrompt.questionPromptId
        WHERE QuestionPrompt.topicId = ${topicId} AND QuestionPrompt.programmingLanguageId = ${langId} AND QuestionPrompt.proficiencyLevelId = ${diffId} AND Question.active = 1 AND Question.assignment = 0`;
        const raw2 = await pool.query(sql2);
        const data2 = raw2[0].map((item) => {
            return item.questionId;
        });

        //Find the difference between both lists
        const difference = data2.filter((x) => !data.includes(x));

        //Sort the array of remaining questions so that the smallest id will always be returned if the user has not completed it yet
        const sorted = difference.sort();
        //if both are empty, difference will be an empty list, return zero

        var send = sorted[0];

        if (sorted.length == 0) {
            send = 0;
        }
        // else return the first value in the sorted array
        return send;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function checkPrompt(topicId, diffId, langId) {
    //Check prompt will return a value of prompt ID or an empty list
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
        const sql = `SELECT QuestionPrompt.questionPromptId
        FROM gamifyDb.QuestionPrompt
        WHERE QuestionPrompt.topicId = ${topicId} AND QuestionPrompt.programmingLanguageId = ${langId} AND QuestionPrompt.proficiencyLevelId = ${diffId}`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return item.questionPromptId;
        });
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function getQfromPrompt(topicId, langId, diffId) {
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
        const sql = `SELECT Question.textContent FROM gamifyDb.Question 
        LEFT JOIN gamifyDb.QuestionPrompt ON Question.questionPromptId = QuestionPrompt.questionPromptId
        WHERE QuestionPrompt.topicId = ${topicId} AND QuestionPrompt.programmingLanguageId = ${langId} AND QuestionPrompt.proficiencyLevelId = ${diffId} AND Question.active = 1 AND Question.assignment = 0`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return item.textContent;
        });
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function getQfromID(qId) {
    try {
        if (qId == null || qId == "undefined") {
            throw "question Id is null or undefined";
        }
        const sql = `SELECT Question.textContent FROM gamifyDb.Question WHERE Question.questionId = ${qId}`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return item.textContent;
        });
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function createPrompt(topicId, diffId, langId) {
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
        const sql = `INSERT INTO gamifyDb.QuestionPrompt(topicId, programmingLanguageId, proficiencyLevelId) VALUES (${topicId}, ${langId}, ${diffId})`;
        const raw = await pool.query(sql);

        const data = raw[0].insertId;

        //The returned value is the new Prompt ID that has been created
        return [data];
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function createQuestion(textContent, score, questionPromptId, assignment) {
    try {
        if (textContent == null || textContent == "undefined" || textContent.length == 0) {
            throw "text content is null or undefined";
        }
        if (score == null || score == "undefined") {
            throw "score is null or undefined";
        }
        if (questionPromptId == null || questionPromptId == "undefined") {
            throw "Question Prompt Id is null or undefined";
        }
        const sql = `INSERT INTO gamifyDb.Question(textContent, score, questionPromptId, active, assignment) VALUES (?, ?, ?, 1, ?)`;
        const raw = await pool.query(sql, [textContent, score, questionPromptId, assignment]);

        const data = raw[0].insertId;
        //The returned value is the new Prompt ID that has been created
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
export async function createLearnerQ(userId, questionId, completed) {
    try {
        if (userId == null || userId == "undefined") {
            throw "userId is null or undefined";
        }
        if (questionId == null || questionId == "undefined") {
            throw "questionId is null or undefined";
        }
        if (completed == null || completed == "undefined") {
            throw "completed is null or undefined";
        }
        const sql = `INSERT INTO gamifyDb.LearnerQuestions(userId, questionId, completed) VALUES (${userId}, ${questionId}, ${completed})`;
        const raw = await pool.query(sql);

        const data = raw[0].insertId;
        //The returned value is the new Prompt ID that has been created
        return data;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
async function insertHint(textContent, qId) {
    try {
        if (textContent == null || textContent == "undefined" || textContent.length == 0) {
            throw "text content is null or undefined";
        }
        const sql = `UPDATE gamifyDb.Question SET Question.hint = "${textContent}" WHERE Question.questionId = ${qId}`;
        const raw = await pool.query(sql);
        return raw;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
//Hint will take qId and gnerate a hint for the question and save that hint to the questions table, if the question
//already has a hint then that hint will be returned to the front end
export async function hint(qId, res) {
    var hint = "";

    try {
        if (qId == null || qId == "undefined") {
            throw "question Id is null or undefined";
        }
        const sql = `SELECT Question.textContent, Question.hint FROM gamifyDb.Question WHERE Question.questionId = ${qId}`;
        const raw = await pool.query(sql);
        const data = raw[0].map((item) => {
            return {
                text: item.textContent,
                hint: item.hint,
            };
        });
        hint = data[0].hint;

        if (hint == null) {
            const generatedHint = await generateHint(data[0].text, res);
            const stringHint = String(generatedHint);
            const type = typeof stringHint;
            if (generatedHint == null || type != "string") {
                throw "generateHint failed";
            }
            const inserthint = await insertHint(generatedHint, qId);
            hint = generatedHint;
        } else {
            const parsedChunk = { hint };
            res.write(`${JSON.stringify(parsedChunk)}\n\n`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    } finally {
        res.end();
    }
}

async function updateTopicBugs(qId) {
    try {
        //First we need to get the topic id from questionId
        if (qId == null || qId == "undefined") {
            throw "question Id is null or undefined";
        }
        const sql = `SELECT Question.questionId, QuestionPrompt.topicId, Topic.bugsReported 
        FROM gamifyDb.Question
        LEFT JOIN gamifyDb.QuestionPrompt
        ON Question.questionPromptId = QuestionPrompt.questionPromptId
        LEFT JOIN gamifyDb.Topic
        ON QuestionPrompt.topicId = Topic.topicId
        WHERE Question.questionId = ?`;
        const raw = await pool.query(sql, [qId]);
        const topicId = raw[0][0].topicId;
        const bugsReported = raw[0][0].bugsReported;
        console.log(raw[0]);
        console.log({ topicId: topicId });
        const newB = Number(bugsReported) + 1;
        console.log(newB);
        const sql2 = `UPDATE gamifyDb.Topic SET Topic.bugsReported = ? WHERE Topic.topicId = ?`;
        const raw2 = await pool.query(sql2, [newB, topicId]);
        console.log(raw2[0]);
        if (raw2[0].affectedRows == 1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}

export async function reportQ(qId, userId) {
    try {
        if (qId == null || qId == "undefined") {
            throw "question Id is null or undefined";
        }
        const sql1 = `SELECT Question.score FROM gamifyDb.Question WHERE Question.questionId = ${qId} AND Question.active = 1`;
        const raw = await pool.query(sql1);
        const data = raw[0].map((item) => {
            return {
                score: item.score,
            };
        });

        let score = data[0].score;
        score = score - 10;

        const sql2 = `UPDATE gamifyDb.Question SET Question.score = ${score} WHERE Question.questionId = ${qId}`;
        const raw2 = await pool.query(sql2);
        const report = {
            info: "Question Score Updated",
            changedRows: raw2[0].changedRows,
        };

        await pool.query("UPDATE gamifyDb.Learner SET Learner.level = Learner.level + 1 WHERE Learner.userId = ?", [userId]);

        const updateTopic = await updateTopicBugs(qId);
        if (updateTopic) {
            return report;
        } else {
            return "ERROR";
        }
    } catch (err) {
        console.log(err);
        return { error: err };
    }
}
//checkTopicSim is used once a new question has been generated
//The purpose of the function is to determine how similar a question is to the topic that was sent
export async function checkTopicSim(topic, textContent) {
    try {
        const topics = topic;
        const question = textContent;
        if (!topics || !question) {
            throw "Missing Fields {topic, question} in open AI prompt";
        }

        const GPT3Prompt = `Given a topic, and a question, determine how related a question is a given topic, provide this value as a percentage out of 100. The topic is ${topics} and the question is ${textContent}. Only return the percentage value, do not return any text please.`;

        let bool = false;
        let score;
        while (bool == false) {
            const response = await openaiClient.createCompletion({
                model: "text-davinci-003",
                prompt: GPT3Prompt,
                max_tokens: 10,
                top_p: 1,
                // We change the temp so that a prompt of the same componenets {language, topic, proficiency} does not return the same as a question previous
                temperature: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            score = response.data.choices[0].text;
            bool = Utils.containsOnlyNumbers(score);
        }
        score = Number(score);
        return score;
    } catch (err) {
        throw err;
    }
}
// MAIN LOGICAL BLOCK
export async function question(topicId, diffId, langId, userId, res) {
    try {
        if (userId == null || userId == "undefined") {
            throw "User Id is null or undefined";
        }
        if (topicId == null || topicId == "undefined") {
            throw "topic Id is null or undefined";
        }
        if (diffId == null || diffId == "undefined") {
            throw "difficulty Id is null or undefined";
        }
        if (langId == null || langId == "undefined") {
            throw "language Id is null or undefined";
        }
        //Here we check if the user has an attempted question or not, essentially if there is a question of the same prompt format, and has been linked to the user, but has not been completed we then would submit that question back to the user
        const sql = `SELECT Learner.userId, LearnerQuestions.questionId, LearnerQuestions.partialAnswer, LearnerQuestions.dateCompleted, LearnerQuestions.completed, Question.textContent, QuestionPrompt.topicId, QuestionPrompt.programmingLanguageId, QuestionPrompt.proficiencyLevelId, Question.active
        FROM gamifyDb.Learner 
        RIGHT JOIN gamifyDb.LearnerQuestions ON Learner.userId = LearnerQuestions.userId 
        LEFT JOIN gamifyDb.Question ON LearnerQuestions.questionId = Question.questionId 
        LEFT JOIN gamifyDb.QuestionPrompt ON Question.questionPromptId = QuestionPrompt.questionPromptId 
        WHERE Learner.userId = ${userId} AND QuestionPrompt.topicId = ${topicId} AND QuestionPrompt.programmingLanguageId = ${langId} AND QuestionPrompt.proficiencyLevelId = ${diffId} AND LearnerQuestions.completed = 0 AND Question.active = TRUE AND Question.assignment = 0`;
        const raw = await pool.query(sql);
        if (raw[0].length == 0) {
            //HERE IS WHERE WE WOULD NORMALLY FIRST CHECK IF THERE IS A QUESTION IN THE DB THAT THE USER HAS NOT ANSWERED BEFORE THAT IS OF THE SAME PROMPT STRUCTURE
            const dbQ = await checkOverLap(topicId, diffId, langId, userId);

            //The return structure of this function is a single value, if the list is empty then the database does not hold a question of the same prompt attributes OR the user has completed all questions that have been generated
            if (dbQ == 0) {
                //if dbQ returns 0 then we need to:
                //1.) We need to check the prompt table for this combination of prompt attributes
                let promptID = await checkPrompt(topicId, diffId, langId);
                if (promptID.length == 0) {
                    //2.) We need to add the new prompt into the table
                    //If the prompt id array returned by checkPrompt is of length 0 then there is no matching prompt ID therefore we need to create one
                    let createPromptID = await createPrompt(topicId, diffId, langId);
                    //Here set the promptID to the created ID to be used later
                    promptID = createPromptID[0];
                } else {
                    //Else we set the prompt id found in the check to the promptID var
                    promptID = promptID[0];
                }

                // //3.b) We need to grab the list of questions that already exists for the prompt
                const existingQuestions = await getQfromPrompt(topicId, langId, diffId);

                const topic = await getTopic(topicId);
                const lang = await getLanguages(langId);
                const diff = await getDifficulty(diffId);

                var generateQ = await generateUniqueQuestion(topic, lang, diff, existingQuestions, res);

                console.log(generateQ);
                const qId = await createQuestion(generateQ, 100, promptID, 0);

                console.log(qId);
                const learnerQId = await createLearnerQ(userId, qId, 0);
                const data = {
                    id: qId,
                    textContent: "",
                };
                res.write(`${JSON.stringify(data)}\n\n`);
            } else {
                const DBquestion = await getQfromID(dbQ);
                const learnerQID = await createLearnerQ(userId, dbQ, 0);
                const parsedChunk = {
                    id: dbQ,
                    textContent: DBquestion[0],
                };

                res.write(`${JSON.stringify(parsedChunk)}\n\n`);
            }
        } else {
            console.log("Exists");
            const data = raw[0].map((item) => {
                return {
                    existing: true,
                    id: item.questionId,
                    textContent: item.textContent,
                    partialAnswer: item.partialAnswer,
                };
            });

            res.write(`${JSON.stringify(data[0])}\n\n`);
        }
    } catch (err) {
        const error = {
            textContent: "An Error has Occured",
        };
        console.log(err);
        return res.write(`${JSON.stringify(error)}\n\n`);
    } finally {
        res.end();
    }
}
