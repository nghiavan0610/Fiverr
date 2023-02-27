const ctaService = require('../services/CTAService');
const { response } = require('../../helpers/Response');

class CTAController {
    // [POST] /api/activities/:list_id/save-item
    async saveItemToList(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            formData.list_id = req.params.list_id;
            const savedItem = await ctaService.saveItemToList(id, formData);
            res.status(201).json(response(savedItem));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/activities/:tag_slug/reviews
    async getAllReview(req, res, next) {
        try {
            const formData = req.body;
            formData.tag_slug = req.params.tag_slug;
            const itemReviews = await ctaService.getAllReview(formData);
            res.status(200).json(response(itemReviews));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/activities/reviews/:review_id
    async getReviewById(req, res, next) {
        try {
            const { review_id } = req.params;
            const itemReview = await ctaService.getReviewById(review_id);
            res.status(200).json(response(itemReview));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/activities/:tag_slug/leave-review
    async createReview(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            formData.tag_slug = req.params.tag_slug;
            const newReview = await ctaService.createReview(id, formData);
            res.status(201).json(response(newReview));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/activities/reviews/edit
    async editReview(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const newReview = await ctaService.editReview(id, formData);
            res.status(201).json(response(newReview));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/activities/reviews/delete
    async deleteReview(req, res, next) {
        try {
            const { id } = req.user;
            const { review_id } = req.body;
            await ctaService.deleteReview(id, review_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/activities/orders
    async getAllOrders(req, res, next) {
        try {
            const { id } = req.user;
            const orders = await ctaService.getAllOrders(id);
            res.status(200).json(response(orders));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/activities/create-order
    async createOrder(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const newOrder = await ctaService.createOrder(id, formData);
            res.status(201).json(response(newOrder));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/activities/complete-order
    async completeOrder(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await ctaService.completeOrder(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/activities/delete-order-history
    async deleteOrderHistory(req, res, next) {
        try {
            const { id } = req.user;
            const { order_id } = req.body;
            await ctaService.deleteOrderHistory(id, order_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/activities/:user_slug/get-user-deleted-orders
    async getUserDeletedOrder(req, res, next) {
        try {
            const { user_slug } = req.params;
            const deletedOrders = await ctaService.getUserDeletedOrder(user_slug);
            res.status(200).json(response(deletedOrders));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/activities/force-delete-order-history
    async forceDeleteOrderHistory(req, res, next) {
        try {
            const { order_id } = req.body;
            await ctaService.forceDeleteOrderHistory(order_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/activities/chat
    async createChat(req, res, next) {
        try {
            const { id } = req.user;
            const { recipient_user_id } = req.body;
            const conversation = await ctaService.createChat(id, recipient_user_id);
            res.status(201).json(response(conversation));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/activities/conversations
    async getAllConversations(req, res, next) {
        try {
            const { id } = req.user;
            const conversations = await ctaService.getAllConversations(id);
            res.status(200).json(response(conversations));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/activities/conversations/:conversation_id
    async getConversationById(req, res, next) {
        try {
            const { id } = req.user;
            const { conversation_id } = req.params;
            const conversation = await ctaService.getConversationById(id, conversation_id);
            res.status(200).json(response(conversation));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CTAController();
