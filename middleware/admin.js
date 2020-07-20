module.exports = function (req, res, next) {
    // If user is not an admin we send a response that says Forbidden
    if(!req.user.isAdmin)  return res.status(403).send('Access Denied')

    next();
}