const redis = require('redis');
const config = require('./env');

const redisClient =
    config.NODE_ENV === 'production' ? redis.createClient({ url: config.REDIS_URL }) : redis.createClient();
console.log(
    config.NODE_ENV,
    config.REDIS_URL,
)(async () => {
    try {
        await redisClient.connect();
        console.log('Connection to Redis has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to Redis:', err);
    }
})();

module.exports = { redisClient };
