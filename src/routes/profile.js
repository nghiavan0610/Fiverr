const express = require('express');
const router = express.Router();
const profileController = require('../app/controllers/ProfileController');
const { requireAuth } = require('../middlewares/AuthMiddleware');
const uploadCloud = require('../middlewares/UploadMiddleware');

router.put('/upload-avatar', requireAuth, uploadCloud.single('avatar'), profileController.uploadAvatar);
router.put('/overview', requireAuth, profileController.updateUserDescription);

// languages
router.post('/languages/create', requireAuth, profileController.createUserLanguage);
router.put('/languages/edit', requireAuth, profileController.updateUserLanguage);
router.delete('/languages/delete', requireAuth, profileController.deleteUserLanguage);

// skills
router.post('/skills/create', requireAuth, profileController.createUserSkill);
router.put('/skills/edit', requireAuth, profileController.updateUserSkill);
router.delete('/skills/delete', requireAuth, profileController.deleteUserSkill);

// education
router.post('/education/create', requireAuth, profileController.createUserEducation);
router.put('/education/edit', requireAuth, profileController.updateUserEducation);
router.delete('/education/delete', requireAuth, profileController.deleteUserEducation);

// certification
router.post('/certification/create', requireAuth, profileController.createUserCertification);
router.put('/certification/edit', requireAuth, profileController.updateUserCertification);
router.delete('/certification/delete', requireAuth, profileController.deleteUserCertification);

module.exports = router;
