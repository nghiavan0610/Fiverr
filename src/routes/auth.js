const express = require('express');
const router = express.Router();
const passport = require('passport');

const { requireAuth } = require('../middlewares/AuthMiddleware');

const authController = require('../app/controllers/AuthController');

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/account', requireAuth, authController.getAccount);
router.get('/signout', requireAuth, authController.signout);

// facebook routes
router.get('/facebook/signin', passport.authenticate('facebook', { authType: 'reauthenticate' }));
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/api/auth/signin' }),
    (req, res) => {
        res.redirect('/api/auth/account');
    },
);

// google routes
router.get('/google/signin', passport.authenticate('google', { authType: 'reauthenticate', scope: ['profile'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/signin' }), (req, res) => {
    res.redirect('/api/auth/account');
});

module.exports = router;
