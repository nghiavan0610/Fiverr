const { ApiError } = require('../../helpers/ErrorHandler');
const cloudinary = require('cloudinary').v2;
const {
    sequelize,
    User,
    Gig,
    GigService,
    GigSubCategory,
    GigCategory,
    UserLanguage,
    Language,
    Review,
    Country,
} = require('../../db/models');
const { gigFilterClause, userFilterClause } = require('../../helpers/FilterClause');

class GigsService {
    // [GET] /api/gigs
    async getAllGigs(queryData) {
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

    // [GET] /api/gigs/:gig_slug
    async getGigBySlug(gig_slug) {
        try {
            const gig = await Gig.findOne({
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
                            'gig_review_rating',
                        ],
                        [
                            sequelize.literal(
                                `(select count(*) from Reviews where Reviews.tag_id = Gig.id and Reviews.tag_type = "GIG")`,
                            ),
                            'gig_total_review',
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
                },
                include: [
                    {
                        attributes: [
                            'id',
                            'name',
                            'avatarUrl',
                            'slug',
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tag_id = GigOwner.id and Reviews.tag_type = "SELLER")`,
                                ),
                                'seller_review_rating',
                            ],

                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tag_id = GigOwner.id and Reviews.tag_type = "SELLER")`,
                                ),
                                'seller_total_review',
                            ],
                        ],
                        model: User,
                        as: 'GigOwner',
                        include: [
                            {
                                attributes: ['id', 'name'],
                                model: Country,
                            },
                            {
                                attributes: ['id', 'level'],
                                model: UserLanguage,
                                include: {
                                    attributes: ['id', 'name', 'slug'],
                                    model: Language,
                                },
                            },
                        ],
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
                where: { slug: gig_slug },
            });
            if (!gig) {
                throw new ApiError(404, `Gig with slug='${gig_slug}' was not found`);
            }
            return gig;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/gigs/categories/:category_slug
    async getAllCategoryGigs(category_slug) {
        try {
            const gigs = await Gig.findAll({
                attributes: {
                    include: [
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
                order: [
                    ['review_rating', 'DESC'],
                    ['review_count', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
                where: { ['$GigService.GigSubCategory.GigCategory.slug$']: category_slug },
            });
            return gigs;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/gigs/sub_categories/:sub_category_slug
    async getAllSubCategoryGigs(sub_category_slug) {
        try {
            const gigs = await Gig.findAll({
                attributes: {
                    include: [
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
                order: [
                    ['review_rating', 'DESC'],
                    ['review_count', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
                where: { ['$GigService.GigSubCategory.slug$']: sub_category_slug },
            });
            return gigs;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/gigs/services/:service_slug
    async getAllServiceGigs(service_slug) {
        try {
            const gigs = await Gig.findAll({
                attributes: {
                    include: [
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
                order: [
                    ['review_rating', 'DESC'],
                    ['review_count', 'DESC'],
                    ['createdAt', 'DESC'],
                ],
                where: { ['$GigService.slug$']: service_slug },
            });
            return gigs;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/gigs/create-gig
    async createGig(id, formData) {
        try {
            const {
                name,
                description,
                price_basic,
                about_basic,
                price_standard,
                about_standard,
                price_premium,
                about_premium,
                gig_service_name,
                gig_sub_category_name,
                gig_category_name,
            } = formData;
            const [seller, gigCategory] = await Promise.all([
                User.findOne({ where: { id, role: 'seller' } }),
                GigCategory.findOne({ where: { name: gig_category_name } }),
            ]);
            if (!seller) {
                throw new ApiError(406, 'You need to be a seller first');
            }
            if (!gigCategory) {
                throw new ApiError(406, `Gig category '${gig_category_name}' was not found`);
            }

            const gigSubCategory = await GigSubCategory.findOne({
                where: {
                    gig_category_id: gigCategory.id,
                    name: gig_sub_category_name,
                },
            });
            if (!gigSubCategory) {
                throw new ApiError(
                    406,
                    `Gig sub_category '${gig_sub_category_name}' was not found or not in '${gig_category_name}' category`,
                );
            }

            const gigService = await GigService.findOne({
                where: {
                    gig_sub_category_id: gigSubCategory.id,
                    name: gig_service_name,
                },
            });
            if (!gigService) {
                throw new ApiError(
                    406,
                    `Gig service '${gig_service_name}' was not found or not in '${gig_sub_category_name}' sub_category`,
                );
            }

            const newGig = await Gig.create({
                name,
                description,
                price_basic,
                about_basic,
                price_standard,
                about_standard,
                price_premium,
                about_premium,
                seller_id: seller.id,
                gig_service_id: gigService.id,
            });

            return newGig;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/gigs/:gig_slug/upload-gig-image
    async uploadGigImage(id, gig_slug, image) {
        try {
            const gig = await Gig.findOne({
                where: { slug: gig_slug, seller_id: id },
            });

            if (!gig) {
                throw new ApiError(404, `Gig with slug='${gig_slug}' was not found or not your gig`);
            }

            if (gig.image) {
                const decodedUrl = decodeURI(gig.image);
                const imageFileName = decodedUrl.split('/').slice(-3).join('/').replace('.jpg', '');

                await cloudinary.uploader.destroy(imageFileName);
            }

            const newGigImage = await gig.update({ image });
            return newGigImage;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/gigs/:gig_slug/edit
    async editGig(id, gig_slug, formData) {
        try {
            const {
                name,
                description,
                price_basic,
                about_basic,
                price_standard,
                about_standard,
                price_premium,
                about_premium,
                gig_service_name,
                gig_sub_category_name,
                gig_category_name,
            } = formData;
            const gigCategory = await GigCategory.findOne({ where: { name: gig_category_name } });
            if (!gigCategory) {
                throw new ApiError(406, `Gig category '${gig_category_name}' was not found`);
            }

            const gigSubCategory = await GigSubCategory.findOne({
                where: {
                    gig_category_id: gigCategory.id,
                    name: gig_sub_category_name,
                },
            });
            if (!gigSubCategory) {
                throw new ApiError(
                    406,
                    `Gig sub_category '${gig_sub_category_name}' was not found or not in '${gig_category_name}' category`,
                );
            }

            const gigService = await GigService.findOne({
                where: {
                    gig_sub_category_id: gigSubCategory.id,
                    name: gig_service_name,
                },
            });
            if (!gigService) {
                throw new ApiError(
                    406,
                    `Gig service '${gig_service_name}' was not found or not in '${gig_sub_category_name}' sub_category`,
                );
            }

            const newGig = await Gig.update(
                {
                    name,
                    description,
                    price_basic,
                    about_basic,
                    price_standard,
                    about_standard,
                    price_premium,
                    about_premium,
                    gig_service_id: gigService.id,
                },
                { where: { slug: gig_slug, seller_id: id } },
            );

            if (!newGig[0] && !newGig[1][0]) {
                throw new ApiError(404, `Gig with slug='${gig_slug}' was not found or not your Gig`);
            }
            return newGig[1][0];
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/gigs/:gig_id/delete
    async deleteGig(id, gig_slug, formData) {
        try {
            const { confirmPassword } = formData;
            const user = await User.findByPk(id, { attributes: ['id', 'password'] });

            if (user && user.matchPassword(confirmPassword)) {
                const deleted = await Gig.destroy({ where: { slug: gig_slug, seller_id: id }, force: true });
                if (!deleted) throw new ApiError(404, `Gig with slug='${gig_slug}' not found or not your Gig`);
            } else {
                throw new ApiError(406, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/gigs/:gig_slug/force-delete
    async adminDeleteGig(id, gig_slug, formData) {
        try {
            const { adminPassword } = formData;
            const admin = await User.findByPk(id, { attributes: ['id', 'password'] });

            if (admin && admin.matchPassword(adminPassword)) {
                const deleted = await Gig.destroy({ where: { slug: gig_slug }, force: true });
                if (!deleted) throw new ApiError(404, `Gig with slug='${gig_slug}' was not found`);
            } else {
                throw new ApiError(406, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new GigsService();
