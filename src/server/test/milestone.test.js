import request from "supertest";
import app from "../app.js";

let user;
let jwt = "";
let jwt2 = "";
let mvp;
// Since there is username checking we use the timestamp to ensure uniqueness
const timestamp = String(Date.now()).slice(-6); //get the last 6 digits of the timestamp

beforeAll(async () => {
    user = {
        username: `test${timestamp}`,
        password: "Test1234!",
        email: `test${timestamp}@mail.com`, // email will be 22 characters long which fits in our database
        firstName: "Test",
        lastName: "User",
    };

    mvp = {
        authenticator: `mvpUser`,
        password: `Test1234!`,
    };

    // const res = await request(app).post("/auth/signup?userRoleId=1").send(user);

    // if (res.status == 201) {
    //     jwt = "Bearer " + res.body.token;
    // } else {
    //     throw new Error("Unable to login and get the JWT token");
    // }

    const res2 = await request(app).post("/auth/login").send(mvp);

    if (res2.status == 200) {
        jwt2 = "Bearer " + res2.body.token;
    } else {
        throw new Error("Unable to login and get the JWT token");
    }
});

describe("Get Milestone Data", () => {
    // test("Trigger initializing User Milestones for new users", async () => {
    //     const res = await request(app).get("/dashboard/milestones").set("Authorization", jwt).send();

    //     expect(res.status).toBe(200);
    //     expect(res.body).toEqual([]);
    // });

    test("Non-Empty miletones for mvpUser", async () => {
        const res = await request(app).get("/dashboard/milestones").set("Authorization", jwt2).send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                {
                    id: 1,
                    title: "Java Beginner",
                    progress: 2,
                    objective: 5,
                    proficiencyLevelId: 1,
                    iconPath: "/image/languageIcons/JAVA_LOGO.svg",
                    badgePath: "/image/beginner/Java1.svg",
                },
                {
                    id: 7,
                    title: "Python Beginner",
                    progress: 1,
                    objective: 5,
                    proficiencyLevelId: 1,
                    iconPath: "/image/languageIcons/PYTHON_LOGO.svg",
                    badgePath: "/image/beginner/Python1.svg",
                },
                {
                    id: 12,
                    title: "Java Intermediate",
                    progress: 1,
                    objective: 5,
                    proficiencyLevelId: 2,
                    iconPath: "/image/languageIcons/JAVA_LOGO.svg",
                    badgePath: "/image/intermediate/Java2.svg",
                },
                {
                    id: 18,
                    title: "Python Intermediate",
                    progress: 1,
                    objective: 5,
                    proficiencyLevelId: 2,
                    iconPath: "/image/languageIcons/PYTHON_LOGO.svg",
                    badgePath: "/image/intermediate/Python2.svg",
                },
                {
                    id: 23,
                    title: "Java Expert",
                    progress: 1,
                    objective: 5,
                    proficiencyLevelId: 3,
                    iconPath: "/image/languageIcons/JAVA_LOGO.svg",
                    badgePath: "/image/expert/Java3.svg",
                },
                {
                    id: 27,
                    title: "JavaScript Expert",
                    progress: 1,
                    objective: 5,
                    proficiencyLevelId: 3,
                    iconPath: "/image/languageIcons/beginner/JAVASCRIPT_LOGO.svg",
                    badgePath: "/image/expert/JS3.svg",
                },
            ])
        );
    });
});
