import dotenv from "dotenv";
import { getCosSims } from "../Utils/cosSim.js";
import openaiClient from "../connection/openai.js";
import * as utils from "../Utils/utils.js";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_Key;

export async function generateUniqueQuestion(topic, language, difficulty, existingsQuestions, res) {
    try {
        if (!topic || !language || !difficulty) {
            throw "Missing Fields {topic, language, difficulty} in open AI prompt";
        }

        var newQuestion = "";
        while (true) {
            newQuestion = await generateQuestion(topic, language, difficulty, res);

            const similar = getCosSims(existingsQuestions, newQuestion);
            if (similar) {
                const parsedChunk = {
                    repeat: true,
                    textContent: "",
                };
                res.write(`${JSON.stringify(parsedChunk)}\n\n`);
            } else {
                break;
            }
        }

        return newQuestion;
    } catch (err) {
        console.log("error");
        throw err;
    }
}

// Ramos: Why is this here?
export async function generate(top, lang, dif) {
    try {
        const topic = top;
        const language = lang;
        const difficulty = dif;
        if (!topic || !language || !difficulty) {
            throw "Missing Fields {topic, language, difficulty} in open AI prompt";
        }

        const GPT3Prompt = [
            { role: "system", content: `You are Computer Science Professor teaching coding to students.` },
            {
                role: "user",
                content: `Create a coding question, that includes a question section, instruction section, and example section. Please make the question specific so a student can give a specific answer. Do not include the answer. The coding question's topic is ${topic}, and the difficulty of the question should be at a ${difficulty} level. The language used in the question is ${language}, include the programming language in the question.`,
            },
        ];

        const response = await openaiClient.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: GPT3Prompt,
            max_tokens: 1000,
            top_p: 1,
            // We change the temp so that a prompt of the same componenets {language, topic, proficiency} does not return the same as a question previous
            temperature: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        return response.data.choices[0].message.content;
    } catch (err) {
        throw err;
    }
}

export async function generateQuestion(topic, language, difficulty, res) {
    var newQuestion = "";

    const GPT3Prompt = [
        { role: "system", content: `You are Computer Science Professor teaching coding to students.` },
        {
            role: "user",
            content: `Create a coding question, that includes a question section, instruction section, and example section. Please make the question specific so a student can give a specific answer. Do not include the answer. The coding question's topic is ${topic}, and the difficulty of the question should be at a ${difficulty} level. The language used in the question is ${language}, include the programming language in the question. Provide the instructions in MarkDown`,
        },
    ];

    try {
        if (!topic || !language || !difficulty) {
            throw "Missing Fields {topic, language, difficulty} in open AI prompt";
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: GPT3Prompt,
                max_tokens: 1000,
                stream: true,
            }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return newQuestion;
            }

            const chunk = decoder.decode(value);

            const lines = chunk.split("\n\n");

            const parsedLines = lines
                .map((line) => {
                    return line.replace(/^data: /, "").trim();
                }) // Remove the "data: " prefix
                .filter((line) => {
                    return line !== "" && line !== "[DONE]";
                }) // Remove empty lines and "[DONE]"
                .map((line) => {
                    return JSON.parse(line);
                }); // Parse the JSON string

            for (const parsedLine of parsedLines) {
                const { choices } = parsedLine;
                const { delta } = choices[0];
                const { content } = delta;

                const parsedChunk = {
                    textContent: content,
                };

                if (content) {
                    res.write(`${JSON.stringify(parsedChunk)}\n\n`);
                    newQuestion += content;
                }
            }
        }
    } catch (err) {
        throw err;
    }
}

export async function generateFeedback(questionContent, answer, res) {
    var foundCorrectness = false;
    var correct = false;
    var feedback = " ";

    try {
        if (!questionContent || !answer) {
            throw "Missing Fields {questionContent, answer} in open AI answer prompt";
        }

        const GPT3Prompt = [
            {
                role: "user",
                content: `Given the following coding question: ${questionContent}. Determine if the answer provided is at least 95% correct. Answer = ${answer}. If the coding question is correct, return only "Answer = 1", if the coding question is incorrect then provide feedback and begin your response with EXACTLY "Answer = 0Nice try! the answer might be wrong because".`,
            },
        ];

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: GPT3Prompt,
                max_tokens: 2000,
                stream: true,
            }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            const chunk = decoder.decode(value);

            const lines = chunk.split("\n\n");

            const parsedLines = lines
                .map((line) => {
                    return line.replace(/^data: /, "").trim();
                }) // Remove the "data: " prefix
                .filter((line) => {
                    return line !== "" && line !== "[DONE]";
                }) // Remove empty lines and "[DONE]"
                .map((line) => {
                    return JSON.parse(line);
                }); // Parse the JSON string

            for (const parsedLine of parsedLines) {
                const { choices } = parsedLine;
                const { delta } = choices[0];
                const { content } = delta;

                if (content) {
                    feedback += content;
                }

                if (foundCorrectness) {
                    const parsedChunk = {
                        feedback: content,
                    };

                    if (content) {
                        res.write(`${JSON.stringify(parsedChunk)}\n\n`);
                    }
                } else {
                    const value = utils.findNumber(feedback);
                    if (value == 1 || value == 0) {
                        var correct = false;
                        console.log(feedback);
                        if (value == 1 && feedback.toLowerCase().includes("answer")) {
                            correct = true;
                        }
                        correct = value == 1;
                        res.write(`${JSON.stringify({ correct: correct })}\n\n`);
                        foundCorrectness = true;
                        feedback = feedback.trim(`Answer = ${value}`);
                        feedback = feedback.trim("\n");
                    }
                }
            }
        }

        return {
            correct,
            feedback,
        };

        // const ans = utils.findNumber(sol);
    } catch (err) {
        throw err;
    }
}

export async function generateHint(textContent, res) {
    var newHint = "";
    try {
        const GPT3Prompt = [
            {
                role: "user",
                content: `Can you provide a concise and short hint to this coding question: ${textContent}`,
            },
        ];

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: GPT3Prompt,
                max_tokens: 1000,
                stream: true,
            }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            const chunk = decoder.decode(value);

            const lines = chunk.split("\n\n");

            const parsedLines = lines
                .map((line) => {
                    return line.replace(/^data: /, "").trim();
                }) // Remove the "data: " prefix
                .filter((line) => {
                    return line !== "" && line !== "[DONE]";
                }) // Remove empty lines and "[DONE]"
                .map((line) => {
                    return JSON.parse(line);
                }); // Parse the JSON string

            for (const parsedLine of parsedLines) {
                const { choices } = parsedLine;
                const { delta } = choices[0];
                const { content } = delta;

                if (content) {
                    newHint += content;

                    const parsedChunk = {
                        hint: content,
                    };
                    res.write(`${JSON.stringify(parsedChunk)}\n\n`);
                }
            }
        }

        return newHint;
        // const ans = utils.findNumber(sol);
    } catch (err) {
        throw err;
    }
}

// async function generateHint(textContent){
//     try{

//         const davinci = `Can you provide a concise and short hint to this coding question: ${textContent}`;
//         const response = await openaiClient.createCompletion({
//             model:  "text-davinci-003",
//             prompt: davinci,
//             max_tokens: 1000,
//             // We change the temp so that a prompt of the same componenets {language, topic, proficiency} does not return the same as a question previous
//             temperature: 1
//         })
//         const hint = response.data.choices[0].text;
//         return hint;
//     }catch(err){
//         console.log(err);
//         return {error: err};
//     }
// };

export default generateUniqueQuestion;
