const request = require('supertest');
const { Course } = require('../models/course');
const { User } = require('../models/user');
let server;


describe('/api/courses', () => {
    // Before each test we will require the local host server
    beforeEach(() => { server = require('../src/server') });

    // After each test we will close the server and remove test courses from database
    afterEach(async () => { 
        // Closes server
        await server.close(); 

        // Removes newly created courses from databasee
        await Course.remove({});
    });

    describe('GET /', () => {
        it('should return all courses', async () => {
            // Inserts test courses into database
           await Course.collection.insertMany([
                { name: 'course1' },
                { name: 'course2'}
            ]);

            // Simulates call to that api endpoin and retuns the promise
            const res = await request(server).get('/api/courses');

            // Expects a succesful response from the server
            expect(res.status).toBe(200);

            // Expects the amonut on documents returned to be 2
            expect(res.body.length).toBe(2);

            // Expects the name in one of the entires to be 'course1' res is an array so used the .some method
            expect(res.body.some(c => c.name === 'course1')).toBeTruthy();
        });
    });

    describe('Get /:id', () => {
        it('should return courses with a specific ID', async () => {
            // Create a new course
            const course = new Course({ name: 'newCourse' });
            // Save the new course in the database
            await course.save();

            // Send request to the courses endpoint with the new course id
            const res = await request(server).get('/api/courses/' + course._id);

            // A 200 success code 
            expect(res.status).toBe(200);
            // Expect the response object to have a property of 'name' and a value of newCourse or course.name
            expect(res.body).toHaveProperty('name', course.name)
        });

        it('should return 404 if invalid ID', async () => {
            // Send request to the courses endpoint with the new course id
            const res = await request(server).get('/api/courses/1');

            // A 200 success code 
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return a 401 if client is not logged in', async () => {
            // Create a post without sending a json web token
         const res = await request(server).post('/api/courses').send({ name: 'course1'});

         expect(res.status).toBe(401);
        });

        it('should return a 400 if course name is less than 3 characters', async () => {
            // Create a Auth Token
            const token = new User().generateAuthToken();

            // Create a post
         const res = await request(server)
            .post('/api/courses')
            .set('x-auth-token', token)
            .send({ name: 'co'});

         expect(res.status).toBe(400);
        });

        it('should return a 400 if course name is more than 15 characters', async () => {
            // Create a Auth Token
            const token = new User().generateAuthToken();

            // Dynamically generate an Array with 16 characters
            const name = new Array(17).join('a');

            // Create a post
         const res = await request(server)
            .post('/api/courses')
            .set('x-auth-token', token)
            .send({ name: name});

         expect(res.status).toBe(400);
        });

        
        it('should save course if it is valid', async () => {
            // Create a Auth Token
            const token = new User().generateAuthToken();

            // Create a post
            const res = await request(server)
                .post('/api/courses')
                .set('x-auth-token', token)
                .send({ name: 'course1'});
            
            // Find the newly created course
            const course = await Course.find({ name: 'course1'});

            expect(course).not.toBeNull();
        });

        it('should save course if it is valid', async () => {
            // Create a Auth Token
            const token = new User().generateAuthToken();

            // Create a post
            const res = await request(server)
                .post('/api/courses')
                .set('x-auth-token', token)
                .send({ name: 'course1'});
            
            // Expect the response to have an ID property
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'course1');
        });
    });
});