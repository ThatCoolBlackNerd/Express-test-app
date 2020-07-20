const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const { Course, validate } = require('../models/course');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');


// returns all courses
router.get('/', async (req, res) => {
        const courses = await Course.find();
        res.send(courses);
});

// returns a course witha specific id
router.get('/:id', validateObjectId, async (req, res) => {
    let id = req.params.id;

    let course = await Course.findById(id)
    if (!course) { // Checks to see if a course exist with the requested id
        res
            .status(404) // retuns error code 4040
            .send('The course with the given ID was not found') // display message for client about error
    } else {
        res.send(course); // if course exist return the request course to the client
    }
});

// POST REQUEST
router.post('/', auth, async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let course = new Course({
        name: req.body.name
    })

        course = await course.save();
        res.send(course)
    
});

// UPDATE REQUEST
router.put('/:id',[validateObjectId, auth], async (req, res) => {
    let id = req.params.id

    // Validate the course and validates the req from the body
    const result = validate(req.body); // Could use object destructuring const { error } = validateCourse(req.body);

    // If invalid, return 400 - Bad request
    if (result.error) return res.status(400).send(result.error.details[0].message);

    //  Look up the course
    let course = await Course.findByIdAndUpdate(id, {name: req.body.name }, { new: true })
    
     // If not existing, return 404
    if (!course) return res.status(404).send('The course with the given ID was not found');

    //Return the updated course to the client
    res.send(course);
});

// DELETE REQUEST
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    let id = req.params.id;

    //  Look up the course
    let course = await Course.findByIdAndRemove(id)

    // If not existing, return 404
    if (!course) return res.status(404).send('The course with the given ID was not found');

    // Return deleted course to client
    res.send(course);
});


module.exports = router;