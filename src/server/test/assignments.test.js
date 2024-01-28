import request from 'supertest';
import * as assignments from '../data/assignments.js';
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
    if(loginResponse.status== 200) {
        jwtInstructor = 'Bearer ' + loginResponse.body.token;
        userId = loginResponse.body.userId;
        userRole = loginResponse.body.userRoleId;
    } else {
        throw new Error('Unable to login and get the JWT token');
    }
});

describe("Post /assignments/createAssignment", () => {

    test('Post createAssignment', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({
            moduleId: 1, 
            name: "Testing Module",  
            topicId: 5,
            diffId: 1,
            langId: 1,
            numberOfQuestions: 1,  
            deadline: "2023-08-12"  
        })

        expect(response.status).toBe(200);
        expect(response.body.id).toBeGreaterThan(1);
    }, 700000);

    test('Post createAssignment without moduleId', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({ 
            name: "Testing Module",  
            topicId: 5,
            diffId: 1,
            langId: 1,
            numberOfQuestions: 1,  
            deadline: "2023-08-12"  
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);

    test('Post createAssignment without name', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({ 
            moduleId: 1,  
            topicId: 5,
            diffId: 1,
            langId: 1,
            numberOfQuestions: 1,  
            deadline: "2023-08-12"  
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);


    test('Post createAssignment without topicId', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({ 
            moduleId: 1,
            name: "Testing Module",  
            diffId: 1,
            langId: 1,
            numberOfQuestions: 1,  
            deadline: "2023-08-12"  
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);

    test('Post createAssignment without diffId', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({ 
            moduleId: 1,
            name: "Testing Module",  
            topicId: 5,
            langId: 1,
            numberOfQuestions: 1,  
            deadline: "2023-08-12"  
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);

    test('Post createAssignment without langId', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({ 
            moduleId: 1,
            name: "Testing Module",  
            topicId: 5,
            diffId: 1,
            numberOfQuestions: 1,  
            deadline: "2023-08-12"  
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);

    test('Post createAssignment without numberOfQuestions', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({ 
            moduleId: 1,
            name: "Testing Module",  
            topicId: 5,
            diffId: 1,
            langId: 1,
            deadline: "2023-08-12"  
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);

    test('Post createAssignment without deadline', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({ 
            moduleId: 1,
            name: "Testing Module",  
            topicId: 5,
            diffId: 1,
            langId: 1,
            numberOfQuestions: 1 
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);

    test('Post createAssignment without any parameters', async()=>{
        const response = await request(app)
        .post('/assignment/createAssignment')
        .set('Authorization', jwtInstructor)
        .send({  
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual("All fields (topicId, languageId, difficultyId, moduleId, name, instructorId) are required.");
    }, 700000);


});
describe("Post /assignments/assignmentVis", () => {

    test('Post createAssignment', async()=>{
        const response = await request(app)
        .post('/assignment/assignmentVis')
        .set('Authorization', jwtInstructor)
        .send({
            moduleId: 1, 
            assignmentId: 3 
        })

        expect(response.status).toBe(200);
        expect(response.body.response).toStrictEqual('Assignment visibility changed')
        console.log(response.body);
    }, 700000);

    test('Post createAssignment without module id', async()=>{
        const response = await request(app)
        .post('/assignment/assignmentVis')
        .set('Authorization', jwtInstructor)
        .send({ 
            assignmentId: 3 
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, moduleId) are required.')
        // console.log(response.body);
    }, 700000);

    test('Post createAssignment without assignmentId', async()=>{
        const response = await request(app)
        .post('/assignment/assignmentVis')
        .set('Authorization', jwtInstructor)
        .send({
            moduleId: 1
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, moduleId) are required.')
        // console.log(response.body);
    }, 700000);

    test('Post createAssignment with no args', async()=>{
        const response = await request(app)
        .post('/assignment/assignmentVis')
        .set('Authorization', jwtInstructor)
        .send({
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, moduleId) are required.')
        // console.log(response.body);
    }, 700000);

});
describe("Delete /assignment/inactivateA", () => {

    test('delete assignment', async()=>{
        const response = await request(app)
        .delete('/assignment/inactivateA')
        .set('Authorization', jwtInstructor)
        .query({
            moduleId: 1,
            assignmentId: 3
        })

        expect(response.status).toBe(200);
        expect(response.body.response).toStrictEqual('Assignment deleted');
        
    }, 700000);

    test('delete assignment without moduleId', async()=>{
        const response = await request(app)
        .delete('/assignment/inactivateA')
        .set('Authorization', jwtInstructor)
        .query({
            assignmentId: 4
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, moduleId) are required.')
        
    }, 700000);

    test('delete assignment without assignmentId', async()=>{
        const response = await request(app)
        .delete('/assignment/inactivateA')
        .set('Authorization', jwtInstructor)
        .query({
            moduleId: 1
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, moduleId) are required.')
        
    }, 700000);


    test('delete assignment with no params', async()=>{
        const response = await request(app)
        .delete('/assignment/inactivateA')
        .set('Authorization', jwtInstructor)
        .query({
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, moduleId) are required.')
        
    }, 700000);

});
describe("Post /assignments/linkStudentAssignment", () => {

    test('Post link student assignments', async()=>{
        const response = await request(app)
        .post('/assignment/linkStudentAssignment')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            classId: 1
        })

        expect(response.status).toBe(200);
        console.log(response.body)
        // expect(response.body.id).toBeGreaterThan(1);
    }, 700000);

    test('Post link student assignments without assignmentId', async()=>{
        const response = await request(app)
        .post('/assignment/linkStudentAssignment')
        .set('Authorization', jwtUser)
        .send({
            classId: 1
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, userId, classId) are required.')
    }, 700000);

    test('Post link student assignments without classId', async()=>{
        const response = await request(app)
        .post('/assignment/linkStudentAssignment')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, userId, classId) are required.')
    }, 700000);

    test('Post link student assignments without classId', async()=>{
        const response = await request(app)
        .post('/assignment/linkStudentAssignment')
        .set('Authorization', jwtUser)
        .send({
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (assignmentId, userId, classId) are required.')
    }, 700000);
});
describe("Post /assignment/saveAssignmentQuestion", () => {

    test('Post save student assignment question answer', async()=>{
        const response = await request(app)
        .post('/assignment/saveAssignmentQuestion')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            questionId: 29,
            textContent: "This is a test for test: POST/ASSIGNMENT/saveAssignmentQuestion",
        })

        expect(response.status).toBe(200);
        // console.log(response.body)
        expect(response.body.affectedRows).toBe(1);
    }, 700000);

    test('Post save student assignment question answer without assignmentId', async()=>{
        const response = await request(app)
        .post('/assignment/saveAssignmentQuestion')
        .set('Authorization', jwtUser)
        .send({
            questionId: 29,
            textContent: "This is a test for test: POST/ASSIGNMENT/saveAssignmentQuestion",
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (textContent, userId, questionId, assignmentId) are required.')
    }, 700000);

    test('Post save student assignment question answer without questionId', async()=>{
        const response = await request(app)
        .post('/assignment/saveAssignmentQuestion')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            textContent: "This is a test for test: POST/ASSIGNMENT/saveAssignmentQuestion",
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (textContent, userId, questionId, assignmentId) are required.')
    }, 700000);

    test('Post save student assignment question answer without textContent', async()=>{
        const response = await request(app)
        .post('/assignment/saveAssignmentQuestion')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            questionId: 1
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (textContent, userId, questionId, assignmentId) are required.')
    }, 700000);


    test('Post save student assignment question answer without any args', async()=>{
        const response = await request(app)
        .post('/assignment/saveAssignmentQuestion')
        .set('Authorization', jwtUser)
        .send({
        })

        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (textContent, userId, questionId, assignmentId) are required.')
    }, 700000);
    
});
describe("Get /assignment/updateQtime", () => {

    test('start assignment timer', async()=>{
        const response = await request(app)
        .get('/assignment/updateQtime')
        .set('Authorization', jwtUser)
        .send({
            questionId: 1,
            assignmentId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    }, 700000);

    test('start assignment timer without questionId', async()=>{
        const response = await request(app)
        .get('/assignment/updateQtime')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (userId, questionId, answerId) are required.')
    }, 700000);

    test('start assignment timer without assignment Id', async()=>{
        const response = await request(app)
        .get('/assignment/updateQtime')
        .set('Authorization', jwtUser)
        .send({
            questionId: 1
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (userId, questionId, answerId) are required.')
    }, 700000);

    test('start assignment timer without any args', async()=>{
        const response = await request(app)
        .get('/assignment/updateQtime')
        .set('Authorization', jwtUser)
        .send({
        })
        //Check if the status is 200
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields (userId, questionId, answerId) are required.')
    }, 700000);
});
describe('Upcoming Assignments Test Suite', ()=> {
    test('fetch upcoming assignments successfully', async()=> {
        const res = await request(app)
        .post('/assignment/upcoming')
        .set('Authorization', jwtUser)
        .send({
            classId: 1
        });

        expect(res.status).toBe(200);

        expect(res.body).toMatchObject([
            {
                id: 6,
                title: "Practice Trees",
                progress: 1,
                objective: 10,
                programmingLanguageId: 3,
                topicId: 8,
                proficiencyLevelId: 1,
                iconPath: "/image/languageIcons/PYTHON_LOGO.svg",
                badgePath: "/image/languageIcons/PYTHON_LOGO.svg"
            }
        ])
    });

    test('upcoming assignments returning empty because 0 questions completed', async()=> {
        const res = await request(app)
        .post('/assignment/upcoming')
        .set('Authorization', jwtUser)
        .send({
            classId: 2
        });

        expect(res.status).toBe(200);

        expect(res.body).toEqual([]);
    })
});
describe('POST /assignment/getAssignmentQAnswer', () => {
    test('Post check student assignment question answer', async()=>{
        const bitFlip = assignments.flipBit();
        
        const response = await request(app)
        .post('/assignment/getAssignmentQAnswer')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            id: 29,
            answer: "function sub(x,y){return x-y;};",
        });
        expect(response.status).toBe(200);
        // console.log(response.body.length);
    }, 700000);

    test('Post check student assignment question answer without assignmentID', async()=>{
        const bitFlip = assignments.flipBit();
        
        const response = await request(app)
        .post('/assignment/getAssignmentQAnswer')
        .set('Authorization', jwtUser)
        .send({
            id: 29,
            answer: "function sub(x,y){return x-y;};",
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields userId, QuestionId, answer) are required.');
        
    }, 700000);

    test('Post check student assignment question answer without questionId', async()=>{
        const bitFlip = assignments.flipBit();
        
        const response = await request(app)
        .post('/assignment/getAssignmentQAnswer')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            answer: "function sub(x,y){return x-y;};",
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields userId, QuestionId, answer) are required.');
        
    }, 700000);

    test('Post check student assignment question answer without answer', async()=>{
        const bitFlip = assignments.flipBit();
        
        const response = await request(app)
        .post('/assignment/getAssignmentQAnswer')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            id: 29,
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields userId, QuestionId, answer) are required.');
        
    }, 700000);

    test('Post check student assignment question answer without any arguments', async()=>{
        const bitFlip = assignments.flipBit();
        
        const response = await request(app)
        .post('/assignment/getAssignmentQAnswer')
        .set('Authorization', jwtUser)
        .send({
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields userId, QuestionId, answer) are required.');
        
    }, 700000);

    test('Post check student assignment question answer without userId', async()=>{
        const bitFlip = assignments.flipBit();
        
        const response = await request(app)
        .post('/assignment/getAssignmentQAnswer')
        .send({
            assignmentId: 1,
            id: 29,
            answer: "function sub(x,y){return x-y;};",
        });
        expect(response.status).toBe(401); 
    }, 700000);
});
describe('POST /assignment/editAssignment', () => {
    
    test('Post edit Assignment', async()=>{
        const response = await request(app)
        .post('/assignment/editAssignment')
        .send({
            assignmentId: 1,
            name: "Test Name1",
            deadline: "2023-08-26"
        });
        expect(response.status).toBe(200);
        // console.log(response.body.length);
    }, 700000);

    test('Post edit Assignment without AssignmentId', async()=>{
        const response = await request(app)
        .post('/assignment/editAssignment')
        .send({
            name: "Test Name1",
            deadline: "2023-08-26"
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields assignmentId, dueDate, and newName are required.');
    }, 700000);

    test('Post edit Assignment without name', async()=>{
        const response = await request(app)
        .post('/assignment/editAssignment')
        .send({
            assignmentId: 1,
            deadline: "2023-08-26"
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields assignmentId, dueDate, and newName are required.');
    }, 700000);


    test('Post edit Assignment without deadline', async()=>{
        const response = await request(app)
        .post('/assignment/editAssignment')
        .send({
            name: "Test Name1",
            assignmentId: 1
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields assignmentId, dueDate, and newName are required.');
    }, 700000);

    test('Post edit Assignment without arguments', async()=>{
        const response = await request(app)
        .post('/assignment/editAssignment')
        .send({
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toStrictEqual('All fields assignmentId, dueDate, and newName are required.');
    }, 700000);
});
describe('POST /assignment/getStudentQuestions', () => {
    
    test('Post getStudentQuestion', async()=>{
        const response = await request(app)
        .post('/assignment/getStudentQuestions')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1,
            classId: 1
        });
        expect(response.status).toBe(200);
    }, 700000);

    test('Post getStudentQuestion without assignmentID', async()=>{
        const response = await request(app)
        .post('/assignment/getStudentQuestions')
        .set('Authorization', jwtUser)
        .send({
            classId: 1
        });
        expect(response.status).toBe(400);
    }, 700000);


    test('Post getStudentQuestion without Class Id', async()=>{
        const response = await request(app)
        .post('/assignment/getStudentQuestions')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1
        });
        expect(response.status).toBe(400);
    }, 700000);

    test('Post getStudentQuestion without arguments', async()=>{
        const response = await request(app)
        .post('/assignment/getStudentQuestions')
        .set('Authorization', jwtUser)
        .send({
            assignmentId: 1
        });
        expect(response.status).toBe(400);
    }, 700000);

    test('Post getStudentQuestion without user Auth', async()=>{
        const response = await request(app)
        .post('/assignment/getStudentQuestions')
        .send({
            assignmentId: 1,
            classId: 1
        });
        expect(response.status).toBe(401);
    }, 700000);

// 
});
describe('POST /assignment/studentStats', () => {
    
    test('Post get Student Statistics', async()=>{
        const response = await request(app)
        .post('/assignment/studentStats')
        .set('Authorization', jwtInstructor)
        .send({
            search: "mock",
            classId: 1
        });
        expect(response.status).toBe(200);
        expect(response.body[0].name).toStrictEqual("mocklearner")
    }, 700000);

    test('Post get Student Statistics without classId', async()=>{
        const response = await request(app)
        .post('/assignment/studentStats')
        .set('Authorization', jwtInstructor)
        .send({
            search: "mock"
        });
        expect(response.status).toBe(400);
    }, 700000);

    test('Post get Student Statistics without search', async()=>{
        const response = await request(app)
        .post('/assignment/studentStats')
        .set('Authorization', jwtInstructor)
        .send({
            search: null,
            classId: 1
        });
        expect(response.status).toBe(200);
    }, 700000);

    test('Post get Student Statistics without any working arguments', async()=>{
        const response = await request(app)
        .post('/assignment/studentStats')
        .set('Authorization', jwtInstructor)
        .send({
            search: null
        });
        expect(response.status).toBe(400);
    }, 700000);

    test('Post get Student Statistics without Instructor Authorization', async()=>{
        const response = await request(app)
        .post('/assignment/studentStats')
        .send({
            search: "mock",
            classId: 1
        });
        expect(response.status).toBe(401);
    }, 700000);
});
