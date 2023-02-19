require('dotenv').config();

const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,

    JWT_SECRET: process.env.JWT_SECRET,
    EXPIRE_IN: process.env.EXPIRE_IN,

    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT,
    DB_NAME: process.env.DB_NAME,
    DB_URL: process.env.DB_URL,

    REDIS_USER: process.env.REDIS_USER,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_URL: process.env.REDIS_URL,

    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,

    SESSION_SECRET: process.env.SESSION_SECRET,
};

module.exports = config;
