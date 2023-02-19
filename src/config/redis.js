const redis = require('redis');
const config = require('../config/env');

const redisClient = config.NODE_ENV === 'production' ? redis.createClient(config.redis_url) : redis.createClient();

(async () => {
    try {
        await redisClient.connect();
        console.log('Connection to Redis has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to Redis:', err);
    }
})();

module.exports = { redisClient };
