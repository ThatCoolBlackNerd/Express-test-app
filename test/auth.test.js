const request = require('supertest');
const { User } = require('../models/user');
const { expectCt } = require('helmet');

describe('auth middleware', () => {
    // Before each test we will require the local host server
    beforeEach(() => { server = require('../src/server') });

    // After each test we will close the server and remove test courses from database
    afterEach(async () => { 
        // Closes server
        await server.close(); 
    });

    let token;

    // Creates a happy path that can be reused in multiple test
    const exec = () => {
        return request(server)
        .post('/api/courses')
        .set('x-auth-token', token)
        .send({ name: 'course1'})
    }

    // Before each test set the token
    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token is provided', async () => {
        // Reset token to an empty string to simulate no token being provided
        token = '';

        // Make a post request to the server that requires a token to be passed and store the response
        const res = await exec();

        // Expect a 401 error in response
        expect(res.status).toBe(401);
    });
});