const express = require('express');
const courses = require('../routes/courses');
const home = require('../routes/home');
const register = require('../routes/register');
const login = require('../routes/auth');
const error = require('../middleware/error');
const helmet = require('helmet');


module.exports = function (app) { 
    app.use(express.json());
    app.use('/api/courses', courses);
    app.use('/api/register', register);
    app.use('/api/login', login);
    app.use('/', home);
    app.use(error);
    app.use(helmet());
}