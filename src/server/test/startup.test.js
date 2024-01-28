import request from "supertest";
import app from '../app.js';

describe('Server startup test', ()=> {
    test('Should respond to server root route', async()=> {
        const res = await request(app)
            .get('/');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({test: 'Hello World!!!'});
    });
});

