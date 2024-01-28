import request from "supertest";
import app from "../app.js";

describe("POST /auth/login", () => {
    test("Learner login", async () => {
        const response = await request(app).post("/auth/login").send({
            authenticator: "mockLearner",
            password: "Test1234!",
        });

        //Check if the status is 200
        expect(response.status).toBe(200);

        // Check if the received userId and userRoleId are correct
        expect(response.body.userId).toBe(1);
        expect(response.body.userRoleId).toBe(1);
    });

    test("Instructor login", async () => {
        const response = await request(app).post("/auth/login").send({
            authenticator: "mockInstructor",
            password: "Test1234!",
        });

        //Check if the status is 200
        expect(response.status).toBe(200);

        // Check if the received userId and userRoleId are correct
        expect(response.body.userId).toBe(2);
        expect(response.body.userRoleId).toBe(3);
    });
});

// TODO: Requires Email Verification
// describe("POST /auth/signup for Learners", () => {
//     let user;

//     // Since there is username checking we use the timestamp to ensure uniqueness
//     const timestamp = String(Date.now()).slice(-6); //get the last 6 digits of the timestamp
//     user = {
//         username: `test${timestamp}`,
//         password: "Test1234!",
//         email: `test${timestamp}@mail.com`, // email will be 22 characters long which fits in our database
//         firstName: "Test",
//         lastName: "User",
//     };

//     // create a random test user
//     test("Successful Learner sign up", async () => {
//         const res = await request(app).post("/auth/signup?userRoleId=1").send(user);

//         expect(res.status).toBe(201);
//         expect(res.body.username).toBe(user.username);
//         expect(res.body.userRoleId).toBe("1");
//     });
//     // Edge case prevention test
//     test("Username already exists", async () => {
//         const res = await request(app).post("/auth/signup?userRoleId=1").send({
//             username: "mockLearner",
//             password: "Test1234!",
//             email: "mockLearner@gmail.com",
//             firstName: "mock",
//             lastName: "Learner",
//         });

//         expect(res.status).toBe(401);
//         expect(res.body.message.username).toBe(`mockLearner is already taken`);
//     });

//     // Email is too big
//     test("Email can`t have above 50 characters", async () => {
//         const res = await request(app).post("/auth/signup?userRoleId=1").send({
//             username: "mockLearner5",
//             password: "Test1234!",
//             email: "mock79uu91fwb78np9zrmxxZHprxVpO9ISYlasddasdasdasdAFa@gmail.com",
//             firstName: "mock",
//             lastName: "Learner",
//         });

//         expect(res.status).toBe(400);
//         expect(res.body.message).toBe("Email should not be above 50 characters!");
//     });
//     // First name is too big
//     test("First name can`t have above 20 characters", async () => {
//         const res = await request(app).post("/auth/signup?userRoleId=1").send({
//             username: "mockLearner5",
//             password: "Test1234!",
//             email: "mock79uu91fwb78np9zrmxxZHprxVpO9IS@gmail.com",
//             firstName: "ThisFirstNameIsWayTooLong",
//             lastName: "Learner",
//         });
//         expect(res.status).toBe(400);
//         expect(res.body.message).toBe("First Name should not be above 20 characters!");
//     });

//     // Last Name is too big
//     test("Last name can`t have above 20 characters", async () => {
//         const res = await request(app).post("/auth/signup?userRoleId=1").send({
//             username: "mockLearner5",
//             password: "Test1234!",
//             email: "mock79uu91fwb78np9zrmxxZHprxVpO9IS@gmail.com",
//             firstName: "FirstName",
//             lastName: "ThisLastNameIsWayTooLong",
//         });
//         expect(res.status).toBe(400);
//         expect(res.body.message).toBe("Last Name should not be above 20 characters!");
//     });
// });

// TODO: Requires Email Verification
// describe("POST /auth/signup for Instructor", () => {
//     let user;

//     const timestamp = String(Date.now()).slice(-7); //get the last 6 digits of the timestamp

//     // Dynamic user that will be different at every test to avoid username already taken for successful sign ups
//     user = {
//         username: `test${timestamp}`,
//         password: "Test1234!",
//         email: `test${timestamp}@mail.com`, // email will be 22 characters long which fits in our database
//         firstName: "Test",
//         lastName: "Instructor",
//         institutionCode: "MOCK100",
//     };
//     // Test for successful signup
//     test("Successful Instructor SignUp", async () => {
//         const res = await request(app).post("/auth/signup?userRoleId=3").send(user);

//         expect(res.status).toBe(201);
//         expect(res.body.username).toBe(user.username);
//         expect(res.body.userRoleId).toBe("3");
//     });
//     // Test for invalid instructor code
//     test("Invalid Instructor code", async () => {
//         const res = await request(app).post("/auth/signup?userRoleId=3").send({
//             username: "mockLearner5",
//             password: "Test1234!",
//             email: "mock79uu91fwb78np9zrmxxZHprxVpO9IS@gmail.com",
//             firstName: "Test",
//             lastName: "Instructor",
//             institutionCode: "MOCK200",
//         });

//         expect(res.status).toBe(401);
//         expect(res.body.message.code).toBe("It is not a valid institution code");
//     });
// });
