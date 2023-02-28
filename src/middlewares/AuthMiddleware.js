const config = require('../config/env');
const { ApiError } = require('../helpers/ErrorHandler');
const { jwtr } = require('../helpers/Token');
const passport = require('passport');

const { User } = require('../db/models');

const requireAuth = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        // if (!req.cookies.jwt) {
        //     throw new ApiError(401, 'Token not found');
        // }
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith('Bearer')) {
            throw new ApiError(401, 'Invalid authorization');
        }

        const token = authorization.split(' ')[1];

        const payload = await jwtr.verify(token, config.JWT_SECRET);
        const user = await User.findByPk(payload.id);
        req.jti = payload.jti;
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { requireAuth };
