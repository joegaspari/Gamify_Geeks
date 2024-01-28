import request from "supertest";
import * as question from "../data/questions.js";
import app from "../app.js";

let jwt = "";

beforeAll(async () => {
    const loginResponse = await request(app).post("/auth/login").send({
        authenticator: "mockLearner",
        password: "Test1234!",
    });

    if (loginResponse.status == 200) {
        jwt = "Bearer " + loginResponse.body.token;
    } else {
        throw new Error("Unable to login and get the JWT token");
    }
});

let qID;

describe("POST /question/getQ", () => {
    test("get Question", async () => {
        const response = await request(app).post("/question/getQ").set("Authorization", jwt).send({
            topicId: 1,
            difficultyId: 1,
            languageId: 5,
        });
        qID = response.body.id;
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.textContent).not.toBeNull();
    }, 700000);

    test("get Question without topicId", async () => {
        const response = await request(app).post("/question/getQ").set("Authorization", jwt).send({
            topicId: null,
            difficultyId: 1,
            languageId: 5,
        });
        //Check if the status is 200
        expect(response.status).toBe(400);
    }, 70000);

    test("get Questio without languageId", async () => {
        const response = await request(app).post("/question/getQ").set("Authorization", jwt).send({
            topicId: 1,
            difficultyId: 1,
            languageId: null,
        });
        //Check if the status is 200
        expect(response.status).toBe(400);
    }, 70000);

    test("get Questio without difficulty Id", async () => {
        const response = await request(app).post("/question/getQ").set("Authorization", jwt).send({
            topicId: 1,
            difficultyId: null,
            languageId: 5,
        });
        //Check if the status is 200
        expect(response.status).toBe(400);
    }, 70000);
});

describe("POST /question/onSave", () => {
    test("save", async () => {
        const response = await request(app).post("/question/onSave").set("Authorization", jwt).send({
            id: 1,
            answer: "THIS IS A TEST ANSWER",
        });

        //Check if the status is 200
        expect(response.status).toBe(200);
    }, 70000);

    test("save without qId", async () => {
        const response = await request(app).post("/question/onSave").set("Authorization", jwt).send({
            id: null,
            answer: "THIS IS A TEST ANSWER",
        });

        //Check if the status is 200
        expect(response.status).toBe(400);
    }, 70000);

    test("save without answer", async () => {
        const response = await request(app).post("/question/onSave").set("Authorization", jwt).send({
            id: 1,
            answer: null,
        });

        //Check if the status is 200
        expect(response.status).toBe(400);
    }, 70000);
});

describe("POST /question/answer", () => {
    test("get answer", async () => {
        const response = await request(app).post("/question/answer").set("Authorization", jwt).send({
            id: 1,
            answer: "THIS IS A TEST ANSWER",
        });

        //Check if the status is 200
        expect(response.status).toBe(200);
    }, 70000);

    test("get answer without id", async () => {
        const response = await request(app).post("/question/answer").set("Authorization", jwt).send({
            id: null,
            answer: "THIS IS A TEST ANSWER",
        });

        //Check if the status is 200
        expect(response.status).toBe(400);
    }, 70000);

    test("get answer without answer content", async () => {
        const response = await request(app).post("/question/answer").set("Authorization", jwt).send({
            id: 1,
            answer: null,
        });

        //Check if the status is 200
        expect(response.status).toBe(400);
    }, 70000);
});

describe("GET /question/hint", () => {
    test("get hint", async () => {
        const response = await request(app).post("/question/hint").send({
            qId: 7,
        });

        expect(response.status).toBe(200);
        expect(response.text.length).toBeGreaterThan(0);
    }, 70000);

    test("get hint with null qId", async () => {
        const response = await request(app).post("/question/hint").send({
            qId: null,
        });

        expect(response.status).toBe(500);
        expect(response.body.error).toStrictEqual("question Id is null or undefined");
    }, 70000);

    test("get hint without qId", async () => {
        const response = await request(app).post("/question/hint").send({});

        expect(response.status).toBe(500);
        expect(response.body.error).toStrictEqual("question Id is null or undefined");
    }, 70000);
});

// Requires Edits
// describe("post /question/report", () => {

//     test('post report', async()=>{
//         const response = await request(app)
//         .post('/question/report')
//         .send({
//             qId : 3
//         })

//         //Check if the status is 200
//         expect(response.status).toBe(200);
//     }, 70000);

//     test('post report without qId', async()=>{
//         const response = await request(app)
//         .post('/question/report')
//         .send({
//             qId : null
//         })

//         //Check if the status is 200
//         expect(response.status).toBe(200);
//         expect(response.body.error).toStrictEqual("question Id is null or undefined")
//     }, 70000);

//     test('post report without qId', async()=>{
//         const response = await request(app)
//         .post('/question/report')
//         .send({
//         })

//         //Check if the status is 200
//         expect(response.status).toBe(200);
//         expect(response.body.error).toStrictEqual("question Id is null or undefined")
//     }, 70000);
// });
