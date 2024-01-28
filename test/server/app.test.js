const app = require('../../src/server/app');
const express = require('express');
// supertest provides high-level abstraction for testing HTTP requests and responses, we will use this to test for APIs.
const request = require('supertest');

app.use(express.urlencoded({extended:false}));
app.use('/', server);

// test suite for the specified route.
describe('GET /server/test', ()=>{
    it('responds with a json message', (done)=>{
        request(app)
        .get('/server/test')
        .set('Accept','application/json')
        .expect(200, {
            message: 'Hello from server!'
        }, done);
    });
});