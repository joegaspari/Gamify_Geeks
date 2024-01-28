import request from "supertest";
import app from "../app.js";

// jwt for userId 1
let jwt = "";
// jwt for mvpUser userId 3
let jwt2 = "";

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

    const loginResponse2 = await request(app).post("/auth/login").send({
        authenticator: "mvpUser",
        password: "Test1234!",
    });
    if (loginResponse2.status == 200) {
        jwt2 = "Bearer " + loginResponse2.body.token;
    } else {
        throw new Error("Unable to login and get the JWT token");
    }
});

describe("Achievements test", () => {
    test("getAchievements existence test", async () => {
        const res = await request(app)
            .get("/dashboard/achievements?userId=1")
            // this token is for userId 1
            .set("Authorization", jwt);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("getAchievements length test", async () => {
        const res = await request(app)
            .get("/dashboard/achievements?userId=1")
            // this token is for userId 1
            .set("Authorization", jwt);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(4);
    });

    test("getAchievements response test", async () => {
        const res = await request(app).get("/dashboard/achievements?userId=1").set("Authorization", jwt);

        expect(res.status).toBe(200);

    });

    test("getAchievements not authenticated", async () => {
        const res = await request(app).get("/dashboard/achievements?userId=1").set("Authorization", "");

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Authentication Error");
    });
});

describe("Leaderboard test", () => {
    test("getLeaderboard existence test", async () => {
        const res = await request(app).get("/dashboard/leaderboard?userId=1").set("Authorization", jwt);

        expect(Array.isArray(res.body)).toBe(true);
    });

    test("getLeaderboard userId 1 test", async () => {
        const res = await request(app).get("/dashboard/leaderboard?userId=1").set("Authorization", jwt);

        const learner = res.body.find((user) => user.userId === 1);
        expect(learner).toBeDefined();
        expect(learner).toMatchObject({
            userId: 1,
            rank: expect.any(Number),
            name: "Mock Learner",
            score: 0,
            img: null,
        });
    });
});

describe("getBadges Test", () => {
    test("Welcome Badge", async () => {
        const res = await request(app).get("/dashboard/badges").set("Authorization", jwt2);

        expect(res.status).toEqual(200);
        expect(res.body).toMatchObject([
            {
                badgeId: 1,
                iconpath: "/image/beginner/NEWBIE1.svg",
                name: "Welcome Badge",
            },
        ]);
    });
});

describe("get Masteries Test", () => {
    test("top masteries for mvpUser", async () => {
        const res = await request(app).get("/dashboard/masteries").set("Authorization", jwt2);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                {
                    id: 1,
                    name: "Arrays",
                },
                {
                    id: 4,
                    name: "Binary Search",
                },
                {
                    id: 2,
                    name: "Hashing",
                },
            ])
        );
    });

    test("empty masteries for mocklearner", async () => {
        const res = await request(app).get("/dashboard/masteries").set("Authorization", jwt);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe("BadgesNotification Test Suite", () => {
    test("Successful badge notification", async () => {
        const res = await request(app).get("/dashboard/notifications").set("Authorization", jwt);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    badgeTitle: "Newcomer",
                    badgeId: 1,
                    difficulty: 1,
                }),
            ])
        );
    });

    test("Missing NotificationId", async () => {
        const res = await request(app).put("/dashboard/claim").set("Authorization", jwt2);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("missing notificationId");
    });

    test("Claim badge notification", async () => {
        const res = await request(app).put("/dashboard/claim").set("Authorization", jwt2).send({ notificationId: 2 });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Updated successfully");
    });

    test("Not getting seen notifications", async () => {
        const res = await request(app).get("/dashboard/notifications").set("Authorization", jwt2);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});
