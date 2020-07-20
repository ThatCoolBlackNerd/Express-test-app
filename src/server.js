const app = require('./app');
const config = require('config');
const PORT = config.get('PORT');
const winston = require('winston');


const server = app.listen(PORT, () => {
    winston.info(`Server listening at http://localhost:${PORT}`)
  })


module.exports = server;
