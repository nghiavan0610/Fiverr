const JWTR = require('jwt-redis').default;
const { redisClient } = require('../config/redis');

const config = require('../config/env');

const jwtr = new JWTR(redisClient);

const generateToken = (id) => {
    return jwtr.sign(id, config.JWT_SECRET, { expiresIn: Number(config.EXPIRE_IN) });
};

const deleteToken = (jti) => {
    return jwtr.destroy(jti, config.JWT_SECRET);
};

module.exports = { jwtr, generateToken, deleteToken };
