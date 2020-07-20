const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi')
const config = require('config');

// Creates a Schema for a new user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5000
    },
    isAdmin: Boolean
});

// Adds JWT Generation as a method to our user object
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('secretKey'));

    return token;
}

// Creates a model for a new User
const User = mongoose.model('User', userSchema);

// Validates User Information from Client
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(5000)
    }
    
    return Joi.validate(user, schema)
}

exports.User = User;
exports.validateUser = validateUser;