import request from 'supertest';
import app from '../app.js';

let jwt = '';

beforeAll(async() => {
    const loginResponse = await request(app)
    .post('/auth/login')
    .send({
        authenticator: 'mocklearner',
        password: 'Test1234!'
    });

    if(loginResponse.status== 200) {
        jwt = 'Bearer ' + loginResponse.body.token;
    } else {
        throw new Error('Unable to login and get the JWT token');
    }

});

describe('Analytics page test suite', ()=> {
    test('getAnalytics Student Test', async()=> {
        const res = await request(app)
        .post('/student/analytics')
        .set('Authorization', jwt)
        .send({classId: '1'});

        expect(res.status).toBe(200);

    });

    test('getAnalytics Student Test if wrong class is sent', async()=> {
        const res = await request(app)
        .post('/student/analytics')
        .set('Authorization', jwt)
        .send({classId: '3'});

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Student is not in the class");

    });

    test('GetLeaderboard Student Test', async()=> {
        const res = await request(app)
        .post('/student/leaderboard')
        .set('Authorization', jwt)
        .send({classId: '1'});

        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                userId: 1,
                score: 1,
                name: "Mock Learner"
            }),
    
        ]))
    });

    test('Get Weekly Stats Test', async()=> {
        const res = await request(app)
        .post('/student/weekly')
        .set('Authorization', jwt)
        .send({classId: '1'});

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: 1,
                day: "Monday"
            }),
            expect.objectContaining({
                id: 2,
                day: "Tuesday"
            }),
            expect.objectContaining({
                id: 3,
                day: "Wednesday"
            }),
            expect.objectContaining({
                id: 4,
                day: "Thursday"
            }),
            expect.objectContaining({
                id: 5,
                day: "Friday"
            }),
            expect.objectContaining({
                id: 6,
                day: "Saturday"
            }),
            expect.objectContaining({
                id: 7,
                day: "Sunday"
            }),
        ]))
    })
});

describe('GET Calendar Streaks', () => {

    test('get calendar streaks', async()=>{
        const response = await request(app)
        .get('/student/calStreak')
        .set('Authorization', jwt)
        .query({
            month: "August",
            year: "2023"
        })
        .send({
            studentId: 1
        });
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0);

    });

    test('get calendar streaks without studentId or userId', async()=>{
        const response = await request(app)
        .get('/student/calStreak')
        .query({
            month: "August",
            year: "2023"
        });
        expect(response.status).toBe(401);
    });

    test('get calendar streaks without userId', async()=>{
        const response = await request(app)
        .get('/student/calStreak')
        .set('Authorization', jwt)
        .query({
            month: "August",
            year: "2023"
        });
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test('get calendar streaks without month', async()=>{
        const response = await request(app)
        .get('/student/calStreak')
        .set('Authorization', jwt)
        .query({
            year: "2023"
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields month, year, userId are required.");
    });

    test('get calendar streaks without year', async()=>{
        const response = await request(app)
        .get('/student/calStreak')
        .set('Authorization', jwt)
        .query({
            month: "August"
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields month, year, userId are required.");
    });


});


describe('GET Total Streaks', () => {

    test('get total streaks', async()=>{
        const response = await request(app)
        .get('/student/totalStreak')
        .set('Authorization', jwt)
        .send({
            studentId: 1
        });

        expect(response.status).toBe(200);
        expect(response.body.streakCount).toBeGreaterThanOrEqual(0);

    });

    test('get total streaks without studentId', async()=>{
        const response = await request(app)
        .get('/student/totalStreak')
        .set('Authorization', jwt);

        expect(response.status).toBe(200);
        expect(response.body.streakCount).toBeGreaterThanOrEqual(0);

    });

    test('get total streaks without studentId', async()=>{
        const response = await request(app)
        .get('/student/totalStreak')
        .send({
            studentId: 1
        });
        expect(response.status).toBe(401);
    });
    
});