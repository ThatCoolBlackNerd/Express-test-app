const mongoose = require('mongoose');
const Joi = require('joi');


const courseSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 15
    }
});

const Course = mongoose.model('Course', courseSchema);


// Validation Function
function validateCourse (course) {
    const schema = {
        name: Joi.string(). min(3).required()
    };

    return Joi.validate(course, schema);
}

exports.Course = Course;
exports.validate = validateCourse;