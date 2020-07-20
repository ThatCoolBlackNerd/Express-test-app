const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');


router.get('/me', auth,  async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

router.post('/', async (req, res) => {
    // validate the user info from client
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Make sure user is not already registerd
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User is already registered');
    
    // If user does not already exist create new user
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    // Hashes password to have more encryption
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log(user.password);

    // Save new user in the database
    await user.save()

    // Generate a JWT Web Token
    const token = user.generateAuthToken();

    // Send the new user object back to the client with selected properties
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;