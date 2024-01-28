import request from 'supertest';
import * as utils from '../Utils/utils.js';
import app from '../app.js';

let jwt = '';

beforeAll(async() => {
    const loginResponse = await request(app)
    .post('/auth/login')
    .send({
        authenticator: 'mockLearner',
        password: 'Test1234!'
    });

    if(loginResponse.status== 200) {
        jwt = 'Bearer ' + loginResponse.body.token;
    } else {
        throw new Error('Unable to login and get the JWT token');
    }
});
// If topic card return errors out its due to an inactive jwt token
describe("POST /explore/topicCard", () => {
    let topicLength;

    test('Topic Card Return', async()=>{
        const response = await request(app)
        .post('/explore/topicCard')
        .set('Authorization', jwt)
        .send({
            search: "",
            page: 1,
            pageLength: 30,
            options: {
                sortBy: 1,
                status: 0
            },
            multiOptions: {
                languages: []
            }
        });
    
        // See if we can set the topic length without filters
        topicLength = response.body.topicCards.length;
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.topicCards[0].id).toBe(1);
    });

    test('Topic Card Return with Search', async()=>{
        // let jwt = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg5MTA2NzE3LCJleHAiOjE2ODkxOTMxMTd9.YT5msKIgXwWZDIy80cOE-y9nB6KNGFvHiMvE0rhy5uA';
        
        const searchS = "A";
        
        const response = await request(app)
        .post('/explore/topicCard')
        .set('Authorization', jwt)
        .send({
            search: searchS,
            page: 1,
            pageLength: 30,
            options: {
                sortBy: 1,
                status: 0
            },
            multiOptions: {
                languages: []
            }
        });

        const topicNames = response.body.topicCards.map((item) => {
            return item.title;
        });
        console.log(topicLength);
        const stringMatch = utils.checkStringMatches(topicNames, searchS);
        //Lets confirm that all stings in the topic titles have either a full or partial match
        expect(stringMatch).toBeTruthy();
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.topicCards[0].id).toBe(1);
        expect(response.body.topicCards.length).toBeLessThanOrEqual(topicLength);
    });

    test('Topic Card Return with Language = SQL', async()=>{
        // let jwt = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg5MTA2NzE3LCJleHAiOjE2ODkxOTMxMTd9.YT5msKIgXwWZDIy80cOE-y9nB6KNGFvHiMvE0rhy5uA';
        const response = await request(app)
        .post('/explore/topicCard')
        .set('Authorization', jwt)
        .send({
            search: "",
            page: 1,
            pageLength: 30,
            options: {
                sortBy: 1,
                status: 0
            },
            multiOptions: {
                languages: [7]
            }
        });
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.topicCards[0].languages[0].name).toBe("SQL");
        expect(response.body.topicCards.length).toBeLessThan(topicLength);
        expect(response.body.topicCards.length).toBeLessThan(topicLength);
    });


});

describe("GET /explore/attemptedQuestions", () => {

    test('get attemptedQuestions', async()=>{
        const response = await request(app)
        .get('/explore/attemptedQuestions')
        .set('Authorization', jwt);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(0);

    });

});

describe("GET /explore/languages", () => {

    test('get Languages (full list)', async()=>{
        // let jwt = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg5MTA2NzE3LCJleHAiOjE2ODkxOTMxMTd9.YT5msKIgXwWZDIy80cOE-y9nB6KNGFvHiMvE0rhy5uA';
        const response = await request(app)
        .get('/explore/languages')
        .set('Authorization', jwt);


        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(11);
    });

});

describe("GET /explore/difficulties", () => {

    test('get difficulties (full list)', async()=>{
        // let jwt = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg5MTA2NzE3LCJleHAiOjE2ODkxOTMxMTd9.YT5msKIgXwWZDIy80cOE-y9nB6KNGFvHiMvE0rhy5uA';
        const response = await request(app)
        .get('/explore/difficulties')
        .set('Authorization', jwt);


        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([
            {
                "id": 1,
                "name": "Beginner"
            },
            {
                "id": 2,
                "name": "Intermediate"
            },
            {
                "id": 3,
                "name": "Expert"
            }
        ]);
    });

});


describe("GET /explore/languagesBytopic/:topicId", () => {
    
    test('get languages by topicId (full list)', async()=>{
        const response = await request(app)
        .get('/explore/languagesBytopic/2')

        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(8);
    });

    test('Test nonexistent TopicId', async()=>{
        const response = await request(app)
        .get('/explore/languagesBytopic/200')

        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
        console.log(response.body);
    });

    test('get languages by topicId (full list)', async()=>{
        const response = await request(app)
        .get('/explore/languagesBytopic/27')

        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([
            {
                "id": "7",
                "name": "SQL"
            }
        ]);
    });

});