import request from 'supertest';
import * as modules from '../data/modules.js';
import app from "../app.js";


let jwtUser = '';
let jwtInstructor = '';
let userId = '';
let userRole = '';
beforeAll(async() => {
    const loginResponse = await request(app)
    .post('/auth/login')
    .send({
        authenticator: 'mockLearner',
        password: 'Test1234!'
    });
    userId = loginResponse.body.userId;
    userRole = loginResponse.body.userRoleId;
    if(loginResponse.status== 200) {
        jwtUser = 'Bearer ' + loginResponse.body.token;
    } else {
        throw new Error('Unable to login and get the JWT token');
    }
});

beforeAll(async() => {
    const loginResponse = await request(app)
    .post('/auth/login')
    .send({
        authenticator: 'mockInstructor',
        password: 'Test1234!'
    });
    userId = loginResponse.body.userId;
    userRole = loginResponse.body.userRoleId;
    if(loginResponse.status== 200) {
        jwtInstructor = 'Bearer ' + loginResponse.body.token;
    } else {
        throw new Error('Unable to login and get the JWT token');
    }
});



describe("Get /classModule/getStudentClassModule", () => {

    // test('get classModule', async()=>{
    //     const response = await request(app)
    //     .get('/classModule/getStudentClassModule')
    //     .set('Authorization', jwtUser)
    //     .query({
    //         studentId: 1,
    //         classId: 1
    //     })
    //     //Check if the status is 200
    //     expect(response.status).toBe(200);
    //     expect(response.body.length).toBeGreaterThan(0);
    // }, 700000);

    test('get classModule without classId', async()=>{
        const response = await request(app)
        .get('/classModule/getStudentClassModule')
        .set('Authorization', jwtUser)
        .query({
            studentId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields userId, classId are required.");
    }, 700000);


    test('get classModule without wrong userId', async()=>{
        const response = await request(app)
        .get('/classModule/getStudentClassModule')
        .set('Authorization', jwtUser)
        .query({
            studentId: 40,
            classId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(200);
        // expect(response.body).toStrictEqual("Failed to getClassModule");
    }, 700000);

    test('get classModule without any params', async()=>{
        const response = await request(app)
        .get('/classModule/getStudentClassModule')
        .set('Authorization', jwtUser)
        .query({
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields userId, classId are required.");
    }, 700000);

});

describe("Get /classModule/getInstructorClassModule", () => {

    test('get Instructor classModule', async()=>{
        const response = await request(app)
        .get('/classModule/getInstructorClassModule')
        .set('Authorization', jwtInstructor)
        .query({
            classId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        // expect(response.body.length).toBe(1);
    }, 700000);

    test('get Instructor classModule without classId', async()=>{
        const response = await request(app)
        .get('/classModule/getInstructorClassModule')
        .set('Authorization', jwtInstructor)
        .query({
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields userId, classId are required.");
    }, 700000);

    test('get Instructor classModule with wrong classId', async()=>{
        const response = await request(app)
        .get('/classModule/getInstructorClassModule')
        .set('Authorization', jwtInstructor)
        .query({
            classId: 52
        })
        //Check if the status is 200
        expect(response.status).toBe(200);
    }, 700000);
});

describe("Post /classModule/createModule", () => {

    test('create classModule', async()=>{
        const response = await request(app)
        .post('/classModule/createModule')
        .set('Authorization', jwtInstructor)
        .send({
            classId: 1,
            name: "Test Module"
        })
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.moduleId).toBeGreaterThan(0);
        // expect(response.body.length).toBe(1);
    }, 700000);

    test('create classModule without classId', async()=>{
        const response = await request(app)
        .post('/classModule/createModule')
        .set('Authorization', jwtInstructor)
        .send({
            name: "Test Module"
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        
        expect(response.body.error).toStrictEqual('All fields name, classId are required.');
        //adding
    }, 700000);

    test('create classModule without name', async()=>{
        const response = await request(app)
        .post('/classModule/createModule')
        .set('Authorization', jwtInstructor)
        .send({
            classId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields name, classId are required.');

    }, 700000);

});

describe("Delete /classModule/deleteModule", () => {

    test('delete classModule', async()=>{
        const response = await request(app)
        .delete('/classModule/deleteModule')
        .set('Authorization', jwtInstructor)
        .query({
            moduleId: 1,
            classId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.response).toStrictEqual('Module deleted');
        
    }, 700000);

    test('delete classModule without classId', async()=>{
        const response = await request(app)
        .delete('/classModule/deleteModule')
        .set('Authorization', jwtInstructor)
        .query({
            moduleId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields moduleId and classId are required.');

    }, 700000);

    test('delete classModule without moduleId', async()=>{
        const response = await request(app)
        .delete('/classModule/deleteModule')
        .set('Authorization', jwtInstructor)
        .query({
            classId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields moduleId and classId are required.');

    }, 700000);

    test('delete classModule without any params', async()=>{
        const response = await request(app)
        .delete('/classModule/deleteModule')
        .set('Authorization', jwtInstructor)
        .query({
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields moduleId and classId are required.');

    }, 700000);

});

describe("Post /classModule/changeVis", () => {

    test('Post change visibility', async()=>{
        const response = await request(app)
        .post('/classModule/changeVis')
        .set('Authorization', jwtInstructor)
        .send({
            moduleId: 1,
            classId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body.response).toStrictEqual('Module visibility changed');
        
    }, 700000);

    test('Post change visibility missing moduleId', async()=>{
        const response = await request(app)
        .post('/classModule/changeVis')
        .set('Authorization', jwtInstructor)
        .send({
            classId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields moduleId and classId are required.');
        
    }, 700000);

    test('Post change visibility missing classId', async()=>{
        const response = await request(app)
        .post('/classModule/changeVis')
        .set('Authorization', jwtInstructor)
        .send({
            moduleId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields moduleId and classId are required.');
        
    }, 700000);

    test('Post change visibility missing moduleId & classId', async()=>{
        const response = await request(app)
        .post('/classModule/changeVis')
        .set('Authorization', jwtInstructor)
        .send({
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields moduleId and classId are required.');
        
    }, 700000);
});