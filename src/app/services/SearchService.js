const { ApiError } = require('../../helpers/ErrorHandler');
const { sequelize, User, Gig, GigService, GigSubCategory, GigCategory, Country } = require('../../db/models');
const { gigFilterClause, userFilterClause } = require('../../helpers/FilterClause');

class SearchService {
    // [GET] /api/search/gigs
    async searchGigs(queryData) {
        try {
            const { where, order, page, offset, limit } = gigFilterClause(queryData);
            const gigs = await Gig.findAndCountAll({
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(select count(*) from Orders where Orders.gig_id = Gig.id)`),
                            'gig_selling_quantity',
                        ],
                        [
                            sequelize.literal(
                                `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG")`,
                            ),
                            'review_rating',
                        ],
                        [
                            sequelize.literal(
                                `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG")`,
                            ),
                            'review_count',
                        ],
                    ],
                },
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
                        attributes: ['id', 'name'],
                        model: GigService,
                        include: {
                            attributes: ['id', 'name'],
                            model: GigSubCategory,
                            include: {
                                attributes: ['id', 'name'],
                                model: GigCategory,
                            },
                        },
                    },
                ],
                where,
                order,
                limit,
                offset,
                distinct: true,
                col: 'id',
            });
            if (gigs.count === 0) {
                throw new ApiError(404, 'No Servives found for your search');
            }
            const totalPages = Math.ceil(gigs.count / limit);
            return {
                gigs: gigs.rows,
                page,
                totalGigs: gigs.count,
                totalPages,
            };
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/search/users
    async searchUsers(queryData) {
        try {
            const { where, order, page, offset, limit } = userFilterClause(queryData);

            const users = await User.findAndCountAll({
                attributes: [
                    'id',
                    'name',
                    'avatarUrl',
                    'role',
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
                ],
                include: {
                    attributes: ['id', 'name'],
                    model: Country,
                },
                where,
                order,
                limit,
                offset,
                distinct: true,
                col: 'id',
            });
            if (users.count === 0) {
                throw new ApiError(404, 'No user found for your search');
            }

            const totalPages = Math.ceil(users.count / limit);
            return {
                users: users.rows,
                page,
                totalUsers: users.count,
                totalPages,
            };
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new SearchService();
