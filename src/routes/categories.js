const express = require('express');
const router = express.Router();
const categoriesController = require('../app/controllers/CategoriesController');
const { requireAuth } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/RoleMiddleware');

// services
router.get('/services/', requireAuth, categoriesController.getAllServices);
router.get('/services/:service_slug', requireAuth, categoriesController.getServiceBySlug);
router.post('/services/create-service', requireAuth, requireRole('admin'), categoriesController.createService);
router.put('/services/:service_slug', requireAuth, requireRole('admin'), categoriesController.editService);
router.delete('/services/:service_slug', requireAuth, requireRole('admin'), categoriesController.deleteService);

// sub_categories
router.get('/sub_categories/', requireAuth, categoriesController.getAllSubCategories);
router.get('/sub_categories/:sub_category_slug', requireAuth, categoriesController.getSubCategoryBySlug);
router.post(
    '/sub_categories/create-sub-category',
    requireAuth,
    requireRole('admin'),
    categoriesController.createSubCategory,
);
router.put(
    '/sub_categories/:sub_category_slug',
    requireAuth,
    requireRole('admin'),
    categoriesController.editSubCategory,
);
router.delete(
    '/sub_categories/:sub_category_slug',
    requireAuth,
    requireRole('admin'),
    categoriesController.deleteSubCategory,
);

// categories
router.get('/', requireAuth, categoriesController.getAllCategories);
router.get('/:category_slug', requireAuth, categoriesController.getCategoryBySlug);
router.post('/create-category', requireAuth, requireRole('admin'), categoriesController.createCategory);
router.put('/:category_slug', requireAuth, requireRole('admin'), categoriesController.editCategory);
router.delete('/:category_slug', requireAuth, requireRole('admin'), categoriesController.deleteCategory);

module.exports = router;
