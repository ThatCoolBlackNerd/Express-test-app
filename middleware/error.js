const winston = require('winston');

module.exports = function (err, req, res, next) {
    // Log the exception here
    winston.log('error', err.message, err);
    // Error handling logic
    res.status(500).send('Something Failed');
}