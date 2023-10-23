const ApiError = require('../exceptions/api-error');
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userRole = decoded.role;

        if (userRole !== 'admin') {
            return next(ApiError.ForbiddenError(`Your role does not have permission to access this resource`));
        }
        req.user.role = userRole;
        next();
    } catch (e) {
        return next(ApiError.ForbiddenError(`Your role does not have permission to access this resource`));
    }
}

