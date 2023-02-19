const express = require('express');
const router = express.Router();
const settingController = require('../app/controllers/SettingController');
const { requireAuth } = require('../middlewares/AuthMiddleware');

router.put('/account/edit', requireAuth, settingController.updateUserAccount);
router.delete('/account/deactivate', requireAuth, settingController.deactivateUserAccount);
router.put('/security/edit', requireAuth, settingController.updateUserSecurity);

module.exports = router;
