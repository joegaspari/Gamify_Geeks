import request from "supertest";
import app from "../app.js";

// jwt for userId 1
let jwt = "";
// jwt for userId = 2
let jwt2 = "";
// jwt for userId = 3
let jwt3 = "";

beforeAll(async () => {
    const loginResponse = await request(app).post("/auth/login").send({
        authenticator: "mocklearner",
        password: "Test1234!",
    });

    if (loginResponse.status == 200) {
        jwt = "Bearer " + loginResponse.body.token;
    } else {
        throw new Error("Unable to login and get the JWT token");
    }

    const timestamp = String(Date.now()).slice(-6); //get the last 6 digits of the timestamp

    const loginResponse2 = await request(app).post("/auth/login").send({
        authenticator: "mockInstructor",
        password: "Test1234!",
    });

    if (loginResponse2.status == 200) {
        jwt2 = "Bearer " + loginResponse2.body.token;
    } else {
        throw new Error("Unable to login and get the JWT token");
    }

    // const signResponse = await request(app)
    //     .post("/auth/signup?userRoleId=1")
    //     .send({
    //         username: `test${timestamp}`,
    //         password: "Test1234!",
    //         email: `test${timestamp}@mail.com`, // email will be 22 characters long which fits in our database
    //         firstName: "Test",
    //         lastName: "User",
    //     });

    // if (signResponse.status == 201) {
    //     jwt3 = "Bearer " + signResponse.body.token;
    // } else {
    //     throw new Error("Unable to sign up and get JWT token");
    // }
});

describe("getProfile Information Test Suite", () => {
    test("getProfile Learner Test", async () => {
        const res = await request(app).get("/profile?userId=1").set("Authorization", jwt);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: 1,
            name: "MockLearner",
            firstName: "Mock",
            lastName: "Learner",
            username: "mocklearner",
            email: "mocklearner@gmail.com",
            userRoleId: 1,
            title: "Newcomer",
            profileImg: null,
            bannerImg: null,
            level: 1,
            streakDays: null,
        });
    });

    test("getProfile authentication error", async () => {
        const res = await request(app).get("/profile").set("Authorization", "");

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Authentication Error");
    });

    test("getProfile Instructor Test", async () => {
        const res = await request(app).get("/profile").set("Authorization", jwt2);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: 2,
            name: "MockInstructor",
            firstName: "Mock",
            lastName: "Instructor",
            username: "mockinstructor",
            email: "mockinstructor@gmail.com",
            userRoleId: 3,
            institutionName: "Mock Academy",
        });
    });
});

describe("getClasses Test Suite", () => {
    test("Classes response test", async () => {
        const res = await request(app).get("/profile/classes").set("Authorization", jwt);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            {
                classId: 1,
                name: "Mock Class 499",
                description: "A mock class to help us understand the system for MVP!",
                img: null,
                joinCode: "MOCK499",
            },
            {
                classId: 2,
                name: "Mock Class 211",
                description: "Another mock class to help us understand the system for MVP!",
                img: null,
                joinCode: "MOCK211",
            },
        ]);
    });

    test("Classes authentication error", async () => {
        const res = await request(app).get("/profile/classes").set("Authorization", "");

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Authentication Error");
    });

    test("Classes for instructor response test", async () => {
        const res = await request(app).get("/profile/classes").set("Authorization", jwt2);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    classId: 1,
                    name: "Mock Class 499",
                    description: "A mock class to help us understand the system for MVP!",
                    img: null,
                }),
            ])
        );
    });

    test("Classes search query test", async () => {
        const res = await request(app).get("/profile/classes?search=21").set("Authorization", jwt2);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    classId: 2,
                    name: "Mock Class 211",
                    description: "Another mock class to help us understand the system for MVP!",
                    img: null,
                }),
            ])
        );
    });
});

// describe("Join Class Test Suite", () => {
//     test("Wrong Join Code", async () => {
//         const res = await request(app).post("/profile/joinClass").set("Authorization", jwt3).send({
//             joinCode: "ASDADASDSA",
//         });

//         expect(res.status).toBe(404);
//         expect(res.body.message).toBe("Invalid Join Code");
//     });

//     test("Join Class successful", async () => {
//         const res = await request(app).post("/profile/joinClass").set("Authorization", jwt3).send({
//             joinCode: "MOCK499",
//         });

//         expect(res.status).toBe(201);
//         expect(res.body).toEqual({
//             classId: 1,
//             name: "Mock Class 499",
//             description: "A mock class to help us understand the system for MVP!",
//             img: null,
//         });
//     });

//     test("Already in that class", async () => {
//         const res = await request(app).post("/profile/joinClass").set("Authorization", jwt3).send({
//             joinCode: "MOCK499",
//         });

//         expect(res.status).toBe(409);
//         expect(res.body.message).toBe("You are already in that class!");
//     });
// });

describe("GET user badge titles", () => {
    test("get user badge titles", async () => {
        const response = await request(app).get("/profile/titles").set("Authorization", jwt);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("get user badge titles without userId", async () => {
        const response = await request(app).get("/profile/titles");

        expect(response.status).toBe(401);
    });
});
