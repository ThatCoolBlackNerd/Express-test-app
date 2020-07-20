const winston = require('winston')
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    // Connection to Database
    mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => winston.info(`Connected to ${config.get('db')}....`));
}