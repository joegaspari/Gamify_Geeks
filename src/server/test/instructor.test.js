import request from 'supertest';
import app from '../app.js';

// jwt for instructor
let jwt = '';

// jwt for learner
let jwt2 = '';

let deletedClassId = '';

beforeAll(async() => {
    const loginResponse = await request(app)
    .post('/auth/login')
    .send({
        authenticator: 'mockInstructor',
        password: 'Test1234!'
    });

    if(loginResponse.status== 200) {
        jwt = 'Bearer ' + loginResponse.body.token;
    } else {
        throw new Error('Unable to login and get the JWT token');
    }

    const loginResponse2 = await request(app)
    .post('/auth/login')
    .send({
        authenticator: 'mockLearner',
        password: 'Test1234!'
    });

    if(loginResponse2.status== 200) {
        jwt2 = 'Bearer ' + loginResponse2.body.token;
    } else {
        throw new Error('Unable to login and get the JWT token');
    }

    const createResponse = await request(app)
    .post('/instructor/createClass')
    .set('Authorization', jwt)
    .send({
        "name": "TEST100",
        "description": "A Test Class to test Delete API"
    });

    if(createResponse.status==201) {
        deletedClassId = createResponse.body.classId;
    } else {
        throw new Error('Unable to crete a new class');
    }

});

describe('POST Create Class Test Suite', ()=> {
    test('Successul creation of class', async()=> {
        const res = await request(app)
        .post('/instructor/createClass')
        .set('Authorization', jwt)
        .send({
            "name": "TEST 100",
            "description": "A test class to test APIs :)"
        });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("TEST 100");
        expect(res.body.description).toBe("A test class to test APIs :)");
    });

    test('Non-Instructor tries to create class', async()=> {
        const res = await request(app)
        .post('/instructor/createClass')
        .set('Authorization', jwt2)
        .send({
            "name": "TEST 100",
            "description": "A test class to test APIs :)"
        });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid User Role');
    })
});

describe('GET Class Overview Test Suite', ()=> {
    test('Successful GET Request', async()=> {
        const res = await request(app)
        .get('/instructor/overview')
        .set('Authorization', jwt);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "classId": expect.any(Number),
                    "name": expect.any(String),
                    "description": expect.any(String),
                    "joinCode": expect.any(String),
                    "studentNumber": expect.any(Number),
                    "created": expect.anything() 
                })
            ])
        );
    });
});

describe('Update Class Overview Test Suite', ()=> {
    test('Updating Class Sucessfully', async()=> {
        const res = await request(app)
        .put('/instructor/edit')
        .set('Authorization', jwt)
        .send({
            classId: 3,
            name: 'MOCK UPDATED',
            description: 'An Updated API to see if the edit class API is working'
        });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            classId: 3,
            name: 'MOCK UPDATED',
            description: `An Updated API to see if the edit class API is working`,
            joinCode: 'MOCK213'
        });
    });
});

describe('Delete Class by ID Test Suite', () => {
    test('Deleting Class Successfully', async()=> {
        const res = await request(app)
        .delete('/instructor/delete')
        .set('Authorization', jwt)
        .send({
            classId: deletedClassId
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Class deleted successfully');
    });

    test('Missing classId', async()=> {
        const res = await request(app)
        .delete('/instructor/delete')
        .set('Authorization', jwt)
        .send({
            
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Missing ClassId!');
    });
});

describe('Instructor analytics Test Suite', ()=> {
    test('Class Analytics Test', async()=> {
        const res = await request(app)
        .post('/instructor/analytics')
        .set('Authorization', jwt)
        .send({
            classId: 1
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "id": 1,
                "num": null
            }),
            expect.objectContaining({
                "id": 2,
                "num": 1
            }),
            expect.objectContaining({
                "id": 3,
                "num": 4
            }),
            expect.objectContaining({
                "id": 4,
                "num": 1.22
            })
        ]))
    });

    test('Missing Class Id test', async()=> {
        const res = await request(app)
        .post('/instructor/analytics')
        .set('Authorization', jwt);

        expect(res.status).toBe(401);
        expect(res.body.message).toEqual('Invalid classId');
    });

    test('Get Weekly Stats Test', async()=> {
        const res = await request(app)
        .post('/instructor/weekly')
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
    });
    
    test('Get Class leaderboard API', async()=> {
        const res = await request(app)
        .post('/instructor/leaderboard')
        .set('Authorization', jwt)
        .send({classId: '1'});

        expect(res.status).toBe(200)
        // expect(res.body).toEqual(expect.arrayContaining([{"img": null, "name": "Mock Learner", "rank": 2, "score": 1, "userId": 1}]));
    })

})
