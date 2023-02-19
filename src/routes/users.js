const express = require('express');
const router = express.Router();
const usersController = require('../app/controllers/UsersController');
const { requireAuth } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/RoleMiddleware');
const uploadCloud = require('../middlewares/UploadMiddleware');

router.post('/create-user', requireAuth, requireRole('admin'), usersController.createUser);
router.put('/:user_slug/edit-user-account', requireAuth, requireRole('admin'), usersController.updateUserAccount);
router.put('/:user_slug/edit-user-security', requireAuth, requireRole('admin'), usersController.updateUserSecurity);
router.delete('/:user_slug/ban-user', requireAuth, requireRole('admin'), usersController.banUser);
router.get('/deleted_users', requireAuth, requireRole('admin'), usersController.getDeletedUser);
router.patch('/deleted_users/:user_slug/restore', requireAuth, requireRole('admin'), usersController.restoreUser);
router.delete(
    '/deleted_users/:user_slug/force-delete',
    requireAuth,
    requireRole('admin'),
    usersController.forceDeleteUser,
);

router.get('/:user_slug', usersController.getUserBySlug);
router.put('/start-selling', requireAuth, uploadCloud.single('avatar'), usersController.startSelling);
router.get('/', usersController.getAllUsers);

module.exports = router;
