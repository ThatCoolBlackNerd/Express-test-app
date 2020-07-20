const winston = require('winston');
require('express-async-errors');

module.exports = function () {
    // Creates a file and console logger for exception handling and errors
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
      
    winston.add(
      // Adds a console and file logger for all logging
      new winston.transports.Console({ colorize: true, prettyPrint: true }),
      new winston.transports.File({ filename: 'logfile.log' }));
      
}