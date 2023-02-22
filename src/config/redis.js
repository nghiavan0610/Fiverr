const redis = require('redis');
const config = require('./env');

const redisClient =
    config.NODE_ENV === 'production' ? redis.createClient({ url: config.REDIS_URL }) : redis.createClient();

(async () => {
    try {
        await redisClient.connect();
        console.log(`Connection to Redis with port='${config.REDIS_PORT}' has been established successfully.`);
    } catch (err) {
        console.error('Unable to connect to Redis:', err);
    }
})();

module.exports = { redisClient };
