const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('../config/env');
const { User } = require('../db/models');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, next) => {
    try {
        const user = await User.findByPk(payload.id);
        if (user) {
            return next(null, { user, jti: payload.jti });
        } else {
            return next(null, false);
        }
    } catch (err) {
        next(err);
    }
});

passport.use(jwtLogin);

passport.serializeUser((user, next) => {
    process.nextTick(() => {
        return next(null, user);
    });
});
