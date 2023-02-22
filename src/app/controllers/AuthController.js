const authService = require('../services/AuthService');
const config = require('../../config/env');

const { response } = require('../../helpers/Response');
const { deleteToken } = require('../../helpers/Token');

class AuthController {
    // [POST] /api/auth/signin
    async signin(req, res, next) {
        try {
            const credentials = req.body;
            const accessToken = await authService.signin(credentials);
            res.cookie('jwt', accessToken, {
                httpOnly: true,
                maxAge: config.EXPIRE_IN * 1000,
            });
            res.status(200).json(response(accessToken));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/auth/signup
    async signup(req, res, next) {
        try {
            const registration = req.body;
            const accessToken = await authService.signup(registration);
            res.cookie('jwt', accessToken, {
                httpOnly: true,
                maxAge: config.EXPIRE_IN * 1000,
            });
            res.status(200).json(response(accessToken));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/auth/account
    async getAccount(req, res, next) {
        try {
            const { id } = req.user;
            const account = await authService.getAccount(id);
            res.status(200).json(response(account));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/auth/signout
    async signout(req, res, next) {
        try {
            if (req.jti) {
                await deleteToken(req.jti);
                res.cookie('jwt', '', { maxAge: '1' });
            } else {
                req.logout((err) => {
                    return next(err);
                });
            }

            res.status(200).json(response(`You've been logged out`));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();
