const express = require('express');
const app = express();

require('dotenv').config()
require('../startup/logging')(app);
require('../startup/routes')(app);
require('../startup/db')(app);

app.set('view engine', 'pug');

module.exports = app;