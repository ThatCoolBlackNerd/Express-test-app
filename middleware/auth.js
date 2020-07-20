const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth (req, res, next) {
    // Retrive token from client through a header request
    const token = req.header('x-auth-token');

    // If there is no token let the client know a token is required
    if (!token) return res.status(401).send('Access Denied: Token Required')

    try {
        // JWT.verify takes that token from the header and decodes it
        const decodedPayload = jwt.verify(token, config.get('secretKey'));

        // If the token is valid above method will return the deocded payload and then we put that paylaod in the request
        req.user = decodedPayload;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid Token.')
    }
   
}



