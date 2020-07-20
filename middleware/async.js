// Middleware function to implement try/catch block in each route without repaiting in in the routes

module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(ex);
        }
    };
}