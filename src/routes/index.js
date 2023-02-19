const authRouter = require('./auth');
const usersRouter = require('./users');
const profileRouter = require('./profile');
const settingRouter = require('./setting');
const gigsRouter = require('./gigs');
const listsRouter = require('./lists');
const ctaRouter = require('./cta');
const searchRouter = require('./search');
const complementRouter = require('./complement');
const categoriesRouter = require('./categories');

const { notFound, errorHandler } = require('../helpers/ErrorHandler');

require('../helpers/Passport');

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/profile', profileRouter);
    app.use('/api/setting', settingRouter);
    app.use('/api/gigs', gigsRouter);
    app.use('/api/lists', listsRouter);
    app.use('/api/activities', ctaRouter);
    app.use('/api/search', searchRouter);
    app.use('/api/complement', complementRouter);
    app.use('/api/categories', categoriesRouter);

    app.use(errorHandler);
    app.use(notFound);
}

module.exports = route;
