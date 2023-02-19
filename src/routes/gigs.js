const express = require('express');
const router = express.Router();
const gigsController = require('../app/controllers/GigsController');
const { requireAuth } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/RoleMiddleware');
const uploadCloud = require('../middlewares/UploadMiddleware');

router.post('/create-gig', requireAuth, gigsController.createGig);
router.post('/:gig_slug/upload-gig-image', requireAuth, uploadCloud.single('image'), gigsController.uploadGigImage);
router.put('/:gig_slug/edit', requireAuth, gigsController.editGig);
router.delete('/:gig_slug/delete', requireAuth, gigsController.deleteGig);
router.delete('/:gig_slug/admin-delete', requireAuth, requireRole('admin'), gigsController.adminDeleteGig);

router.get('/categories/:category_slug', requireAuth, gigsController.getAllCategoryGigs);
router.get('/sub_categories/:sub_category_slug', requireAuth, gigsController.getAllSubCategoryGigs);
router.get('/services/:service_slug', requireAuth, gigsController.getAllServiceGigs);

router.get('/:gig_slug', gigsController.getGigBySlug);
router.get('/', gigsController.getAllGigs);

module.exports = router;
