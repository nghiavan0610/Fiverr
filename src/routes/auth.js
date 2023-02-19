const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/AuthMiddleware');

const authController = require('../app/controllers/AuthController');

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/account', requireAuth, authController.getAccount);
router.get('/signout', requireAuth, authController.signout);

module.exports = router;
