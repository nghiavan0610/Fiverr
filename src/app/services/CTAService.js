const { ApiError } = require('../../helpers/ErrorHandler');
const { sequelize, User, Gig, List, Order, Collection, Review, Country, Conversation } = require('../../db/models');
const { Op } = require('sequelize');

class CTAService {
    // [POST] /api/activities/:list_id/save-item
    async saveItemToList(id, formData) {
        try {
            const { list_id, tag_id, tag_type } = formData;

            if (!(tag_type === 'GIG' || tag_type === 'SELLER')) {
                throw new ApiError(403, `Unknow tag type item: '${tag_type}'`);
            }
            const [list, item] = await Promise.all([
                List.findOne({ where: { id: list_id, user_id: id } }),
                tag_type === 'GIG' ? Gig.findByPk(tag_id) : User.findOne({ where: { id: tag_id, role: 'seller' } }),
            ]);

            if (!list) throw new ApiError(404, `List with id='${list_id}' was not found`);

            if (!item) {
                if (tag_type === 'GIG') {
                    throw new ApiError(404, `Gig with id='${tag_id}' was not found`);
                } else {
                    throw new ApiError(404, `Seller with id='${tag_id}' was not found`);
                }
            }
            const [savedItem, created] = await Collection.findOrCreate({
                where: formData,
                defaults: {},
            });
            if (!created) {
                await savedItem.destroy();
                return;
            }

            return savedItem;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/activities/:tag_id/reviews
    async getAllReview(formData) {
        try {
            const { tag_slug, tag_type } = formData;
            if (tag_type !== 'GIG' && tag_type !== 'SELLER') {
                throw new ApiError(403, `Unknow tag type item: '${tag_type}'`);
            }
            const itemReviews =
                tag_type === 'GIG'
                    ? await Gig.findOne({
                          attributes: [
                              'id',
                              'name',
                              'image',
                              'slug',
                              [
                                  sequelize.literal(
                                      `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG")`,
                                  ),
                                  'gig_review_rating',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG")`,
                                  ),
                                  'gig_review_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG" and Reviews.rating = 5)`,
                                  ),
                                  'gig_review_5_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG" and Reviews.rating = 4)`,
                                  ),
                                  'gig_review_4_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG" and Reviews.rating = 3)`,
                                  ),
                                  'gig_review_3_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG" and Reviews.rating = 2)`,
                                  ),
                                  'gig_review_2_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG" and Reviews.rating = 1)`,
                                  ),
                                  'gig_review_1_count',
                              ],
                          ],
                          include: [
                              {
                                  attributes: ['id', 'name', 'avatarUrl', 'slug'],
                                  model: User,
                                  as: 'GigOwner',
                                  include: {
                                      attributes: ['id', 'name'],
                                      model: Country,
                                  },
                              },
                              {
                                  attributes: ['id', 'rating', 'content', 'review_date'],
                                  model: Review,
                                  as: 'ReviewBody',
                                  include: {
                                      attributes: ['id', 'name', 'avatarUrl', 'slug'],
                                      model: User,
                                      as: 'ReviewOwner',
                                  },
                              },
                          ],
                          where: { slug: tag_slug },
                          order: [['ReviewBody', 'review_date', 'DESC']],
                      })
                    : await User.findOne({
                          attributes: [
                              'id',
                              'name',
                              'avatarUrl',
                              'member_since',
                              'slug',
                              [
                                  sequelize.literal(
                                      `(select count(*) from Orders join Gigs on Orders.gig_id = Gigs.id and Gigs.seller_id = User.id)`,
                                  ),
                                  'seller_selling_quantity',
                              ],
                              [
                                  sequelize.literal(`(select count(*) from Gigs where Gigs.seller_id = User.id)`),
                                  'seller_total_gig',
                              ],
                              [
                                  sequelize.literal(
                                      `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tag_id = User.id and Reviews.tag_type = "SELLER")`,
                                  ),
                                  'seller_review_rating',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = User.id and Reviews.tag_type = "SELLER")`,
                                  ),
                                  'seller_review_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = User.id and Reviews.tag_type = "SELLER" and Reviews.rating = 5)`,
                                  ),
                                  'seller_review_5_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = User.id and Reviews.tag_type = "SELLER" and Reviews.rating = 4)`,
                                  ),
                                  'seller_review_4_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = User.id and Reviews.tag_type = "SELLER" and Reviews.rating = 3)`,
                                  ),
                                  'seller_review_3_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = User.id and Reviews.tag_type = "SELLER" and Reviews.rating = 2)`,
                                  ),
                                  'seller_review_2_count',
                              ],
                              [
                                  sequelize.literal(
                                      `(select count(*) from Reviews where Reviews.tag_id = User.id and Reviews.tag_type = "SELLER" and Reviews.rating = 1)`,
                                  ),
                                  'seller_review_1_count',
                              ],
                          ],
                          include: [
                              {
                                  attributes: ['id', 'name'],
                                  model: Country,
                              },
                              {
                                  attributes: ['id', 'rating', 'content', 'review_date'],
                                  model: Review,
                                  as: 'ReviewBody',
                                  include: {
                                      attributes: ['id', 'name', 'avatarUrl', 'slug'],
                                      model: User,
                                      as: 'ReviewOwner',
                                  },
                              },
                          ],
                          where: { slug: tag_slug },
                          order: [['ReviewBody', 'review_date', 'DESC']],
                      });
            return itemReviews;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/activities/reviews/:review_id
    async getReviewById(review_id) {
        try {
            const itemReview = await Review.findByPk(review_id, {
                include: [
                    {
                        attributes: ['id', 'name', 'avatarUrl', 'slug'],
                        model: User,
                        as: 'ReviewOwner',
                    },
                    {
                        attributes: ['id', 'name', 'image', 'slug'],
                        model: Gig,
                        as: 'ReviewGig',
                        include: {
                            attributes: ['id', 'name', 'avatarUrl', 'slug'],
                            model: User,
                            as: 'GigOwner',
                            include: {
                                attributes: ['id', 'name'],
                                model: Country,
                            },
                        },
                    },
                    {
                        attributes: ['id', 'name', 'avatarUrl', 'slug'],
                        model: User,
                        as: 'ReviewSeller',
                        include: {
                            attributes: ['id', 'name'],
                            model: Country,
                        },
                    },
                ],
            });

            if (!itemReview) {
                throw new ApiError(404, `Review with id='${review_id}' was not found`);
            }
            return itemReview;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/activities/:tag_slug/leave-review
    async createReview(id, formData) {
        try {
            const { tag_slug, rating, content, tag_type } = formData;

            if (!(tag_type === 'GIG' || tag_type === 'SELLER')) {
                throw new ApiError(403, `Unknow tag type item: '${tag_type}'`);
            }

            let item, isOrdered;
            if (tag_type === 'GIG') {
                [item, isOrdered] = await Promise.all([
                    Gig.findOne({ where: { slug: tag_slug } }),
                    Order.findOne({
                        attributes: ['id'],
                        include: {
                            attributes: ['id'],
                            model: Gig,
                            as: 'GigIsOrdered',
                        },
                        where: {
                            user_id: id,
                            is_done: true,
                            [`$GigIsOrdered.slug$`]: tag_slug,
                        },
                    }),
                ]);
            }
            if (tag_type === 'SELLER') {
                [item, isOrdered] = await Promise.all([
                    User.findOne({ where: { slug: tag_slug, role: 'seller' } }),
                    Order.findOne({
                        attributes: ['id'],
                        include: {
                            attributes: ['id'],
                            model: Gig,
                            as: 'GigIsOrdered',
                            include: {
                                attributes: ['id'],
                                model: User,
                                as: 'GigOwner',
                            },
                        },
                        where: {
                            user_id: id,
                            is_done: true,
                            [`$GigIsOrdered.GigOwner.slug$`]: tag_slug,
                        },
                    }),
                ]);
            }
            if (!item) {
                if (tag_type === 'GIG') {
                    throw new ApiError(404, `Gig with slug='${tag_slug}' was not found`);
                } else {
                    throw new ApiError(404, `Seller with slug='${tag_slug}' was not found`);
                }
            }

            if (!isOrdered) {
                if (tag_type === 'GIG') {
                    throw new ApiError(
                        403,
                        `You need to order the gig with slug='${tag_slug}' before you can review on it`,
                    );
                } else {
                    throw new ApiError(
                        403,
                        `You need to order at least one gig from the seller with slug='${tag_slug}' before you can review about this seller`,
                    );
                }
            }

            const [newReview, created] = await Review.findOrCreate({
                where: { user_id: id, tag_id: item.id, tag_type },
                defaults: { rating, content },
            });
            if (!created) {
                await newReview.update({ rating, content });
            }
            return newReview;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/activities/reviews/edit
    async editReview(id, formData) {
        try {
            const { review_id, rating, content } = formData;
            const review = await Review.findOne({ where: { id: review_id, user_id: id } });
            if (!review) {
                throw new ApiError(404, 'This is not your review to edit');
            }

            const newReview = await review.update({ rating, content });
            return newReview;
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/activities/reviews/delete
    async deleteReview(id, review_id) {
        try {
            const review = await Review.findOne({ where: { id: review_id, user_id: id } });
            if (!review) {
                throw new ApiError(404, 'This is not your review to delete');
            }

            await review.destroy();
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/activities/orders
    async getAllOrders(id) {
        try {
            const orders = User.findByPk(id, {
                attributes: [
                    'id',
                    'name',
                    'avatarUrl',
                    'slug',
                    [
                        sequelize.literal(
                            `(select count(*) from Orders where Orders.user_id = User.id and Orders.is_done is true and Orders.deletedAt is null)`,
                        ),
                        'total_completed_order',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Orders where Orders.user_id = User.id and Orders.is_done is false and Orders.deletedAt is null)`,
                        ),
                        'total_pending_order',
                    ],
                ],
                include: {
                    model: Order,
                    as: 'Orders',
                    include: {
                        attributes: ['id', 'name', 'image', 'slug'],
                        model: Gig,
                        as: 'GigIsOrdered',
                        include: {
                            attributes: ['id', 'name', 'avatarUrl', 'email', 'phone', 'slug'],
                            model: User,
                            as: 'GigOwner',
                            include: {
                                attributes: ['id', 'name'],
                                model: Country,
                            },
                        },
                    },
                },
                order: [
                    ['Orders', 'order_date', 'DESC'],
                    ['Orders', 'is_done', 'DESC'],
                ],
            });
            return orders;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/activities/create-order
    async createOrder(id, formData) {
        try {
            const { gig_slug, gig_package } = formData;
            if (!['basic', 'standard', 'premium'].includes(gig_package)) {
                throw new ApiError(403, `Unknow package type: '${gig_package}'`);
            }
            const gig = await Gig.findOne({
                attributes: ['id', 'price_basic', 'price_standard', 'price_premium'],
                where: { slug: gig_slug },
            });
            if (!gig) throw new ApiError(404, `Gig with slug='${gig_slug}' was not found`);

            if (!gig[`price_${gig_package}`]) {
                throw new ApiError(404, `This gig do not have a '${gig_package}' package`);
            }

            const newOrder = await Order.create({
                user_id: id,
                gig_id: gig.id,
                package: gig_package,
            });
            return newOrder;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/activities/complete-order
    async completeOrder(id, formData) {
        try {
            const { order_id } = formData;
            const order = await Order.findOne({
                where: { id: order_id, user_id: id },
            });
            if (!order) throw new ApiError(404, `Order with id='${order}' was not found`);
            if (order.is_done) throw new ApiError(409, 'This Order already completed');

            order.is_done = true;
            await order.save();
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/activities/delete-order-history
    async deleteOrderHistory(id, order_id) {
        try {
            const order = await Order.findOne({ where: { id: order_id, user_id: id } });
            if (!order) {
                throw new ApiError(404, `Order with id='${order_id}' was not found or not your order`);
            }

            if (!order.is_done) {
                throw new ApiError(403, 'Cannot delete pending Order');
            }

            await order.destroy({});
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/activities/:user_slug/get-user-deleted-orders
    async getUserDeletedOrder(user_slug) {
        try {
            const deletedOrders = await Order.findAll({
                include: {
                    model: User,
                    as: 'OrderOwner',
                    where: { slug: user_slug },
                },
                where: { deletedAt: { [Op.not]: null } },
                paranoid: false,
            });
            return deletedOrders;
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/activities/force-delete-order-history
    async forceDeleteOrderHistory(order_id) {
        try {
            const deleted = await Order.destroy({
                where: { id: order_id, deletedAt: { [Op.not]: null } },
                force: true,
                paranoid: false,
            });
            if (!deleted) {
                throw new ApiError(404, `Order with id='${order_id}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/activities/chat
    async createChat(id, recipient_user_id) {
        try {
            const recipient = await User.findByPk(recipient_user_id);
            if (!recipient) {
                throw new ApiError(404, `User with id='${recipient_user_id}' was not found`);
            }

            const [conversation, created] = await Conversation.findOrCreate({
                where: { started_by_user_id: id, recipient_user_id: recipient.id },
                include: {
                    attributes: ['id', 'name', 'avatarUrl', 'slug'],
                    model: User,
                    as: 'RecipientUser',
                },
                defaults: {},
            });
            return conversation;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/activities/conversations
    async getAllConversations(id) {
        try {
            const conversations = await Conversation.findAll({
                where: {
                    [Op.or]: [{ started_by_user_id: id }, { recipient_user_id: id }],
                },
                include: {
                    attributes: ['id', 'name', 'avatarUrl', 'slug'],
                    model: User,
                    as: 'RecipientUser',
                },
                order: [['updatedAt', 'DESC']],
            });
            return conversations;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/activities/conversations/:conversation_id
    async getConversationById(id, conversation_id) {
        try {
            const conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [{ started_by_user_id: id }, { recipient_user_id: id }],
                    [Op.and]: [{ id: conversation_id }],
                },
                include: {
                    attributes: ['id', 'name', 'avatarUrl', 'slug'],
                    model: User,
                    as: 'RecipientUser',
                },
                order: [['updatedAt', 'DESC']],
            });
            return conversation;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new CTAService();
