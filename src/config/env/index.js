require('dotenv').config();

const config = {
    PORT: process.env.PORT,
    SOCKET_PORT: process.env.SOCKET_PORT,
    NODE_ENV: process.env.NODE_ENV,

    JWT_SECRET: process.env.JWT_SECRET,
    EXPIRE_IN: process.env.EXPIRE_IN,

    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT,
    DB_NAME: process.env.DB_NAME,

    REDIS_USER: process.env.REDIS_USER,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_URL: process.env.REDIS_URL,

    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,

    SESSION_SECRET: process.env.SESSION_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,

    GOOGLE_APP_ID: process.env.GOOGLE_APP_ID,
    GOOGLE_APP_SECRET: process.env.GOOGLE_APP_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
};

module.exports = config;
