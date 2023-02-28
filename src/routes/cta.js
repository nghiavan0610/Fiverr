const express = require('express');
const router = express.Router();
const ctaController = require('../app/controllers/CTAController');
const { requireAuth } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/RoleMiddleware');

// save items to list
router.post('/:list_id/save-item', requireAuth, ctaController.saveItemToList);

// review items
router.get('/:tag_slug/reviews', requireAuth, ctaController.getAllReview);
router.get('/reviews/:review_id', requireAuth, ctaController.getReviewById);
router.post('/:tag_slug/leave-review', requireAuth, ctaController.createReview);
router.put('/reviews/edit', requireAuth, ctaController.editReview);
router.delete('/reviews/delete', requireAuth, ctaController.deleteReview);

// order gigs
router.get('/orders', requireAuth, ctaController.getAllOrders);
router.post('/create-order', requireAuth, ctaController.createOrder);
router.put('/complete-order', requireAuth, ctaController.completeOrder);
router.delete('/delete-order-history', requireAuth, ctaController.deleteOrderHistory);
router.get('/:user_slug/get-user-deleted-orders', requireAuth, requireRole('admin'), ctaController.getUserDeletedOrder);
router.delete('/force-delete-order-history', requireAuth, requireRole('admin'), ctaController.forceDeleteOrderHistory);

// chat
// router.post('/chat', requireAuth, ctaController.createChat);
// router.get('/conversations', requireAuth, ctaController.getAllConversations);

module.exports = router;
