const { ApiError } = require('../../helpers/ErrorHandler');
const {
    sequelize,
    User,
    Gig,
    Review,
    Language,
    Skill,
    UserSkill,
    UserLanguage,
    UserEducation,
    UserCertification,
    University,
    Major,
    Country,
    AcademicTitle,
} = require('../../db/models');
const cloudinary = require('cloudinary').v2;
const { Op } = require('sequelize');
const { gigFilterClause, userFilterClause } = require('../../helpers/FilterClause');

class UsersService {
    // [GET] /api/users
    async getAllUsers(queryData) {
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

    // [GET] /api/users/:user_slug
    async getUserBySlug(user_slug) {
        try {
            const user = await User.findOne({
                attributes: {
                    include: [
                        [
                            sequelize.literal(
                                `(select count(*) from Orders join Gigs on Orders.gig_id = Gigs.id join Users on Gigs.seller_id = Users.id and Users.slug = :user_slug)`,
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
                },
                include: [
                    {
                        attributes: ['id', 'name'],
                        model: Country,
                    },
                    {
                        attributes: [
                            'id',
                            'name',
                            'image',
                            'price_basic',
                            'slug',
                            [
                                sequelize.literal(`(select count(*) from Orders where Orders.gig_id = Gigs.id)`),
                                'gig_selling_quantity',
                            ],
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tag_id = Gigs.id and Reviews.tag_type = "GIG")`,
                                ),
                                'gig_review_rating',
                            ],
                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tag_id = Gigs.id and Reviews.tag_type = "GIG")`,
                                ),
                                'gig_review_count',
                            ],
                        ],
                        model: Gig,
                        as: 'Gigs',
                    },
                    {
                        attributes: ['id', 'level'],
                        model: UserLanguage,
                        include: {
                            attributes: ['id', 'name', 'slug'],
                            model: Language,
                        },
                    },
                    {
                        attributes: ['id', 'level'],
                        model: UserSkill,
                        include: {
                            attributes: ['id', 'name', 'slug'],
                            model: Skill,
                        },
                    },
                    {
                        attributes: ['id', 'year_of_graduation'],
                        model: UserEducation,
                        include: [
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: Country,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: University,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: Major,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: AcademicTitle,
                            },
                        ],
                    },
                    {
                        attributes: ['id', 'name', 'certificated_from', 'year_of_certification', 'slug'],
                        model: UserCertification,
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
                replacements: { user_slug },
                where: { slug: user_slug },
                order: [
                    // [sequelize.literal('(`Gigs.gig_review_count` * `Gigs.gig_review_rating`)'), 'DESC'],
                    [sequelize.literal('`Gigs.gig_selling_quantity`'), 'DESC'],
                ],
            });
            if (!user) {
                throw new ApiError(404, `User with slug='${user_slug}' was not found`);
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/users/start-selling
    async startSelling(id, formData) {
        try {
            const { name, about, phone, avatarUrl, confirmEmail } = formData;
            const user = await User.findOne({
                attributes: ['id', 'email', 'role'],
                include: [
                    {
                        attributes: ['id'],
                        model: Country,
                    },
                    {
                        attributes: ['id'],
                        model: UserLanguage,
                    },
                ],
                where: { id },
            });
            if (!user.Country) {
                throw new ApiError(406, 'Please provide your country');
            }
            if (user.UserLanguages.length <= 0) {
                throw new ApiError(406, 'Please provide at least one language');
            }

            if (user && user.role === 'seller') {
                return 'You are already a seller';
            }
            if (user.email === confirmEmail) {
                const userOnboarding = await user.update({
                    name,
                    phone,
                    about,
                    avatarUrl,
                    role: 'seller',
                });
                return userOnboarding;
            } else {
                throw new ApiError(403, 'Your email does not match with your email profile');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/users/create-user
    async createUser(formData) {
        try {
            const { email } = formData;
            const [newUser, created] = await User.findOrCreate({
                where: { email },
                defaults: formData,
            });

            if (!created) {
                throw new ApiError(409, 'Email already exists');
            }
            return newUser;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/users/:user_slug/edit-user-account
    async updateUserAccount(user_slug, formData) {
        try {
            const { country } = formData;
            const countryChecked = await Country.findOne({ attributes: ['id'], where: { name: country } });
            if (!countryChecked) {
                throw new ApiError(404, 'Country not found');
            }
            formData.country_id = countryChecked.id;
            const newUser = await User.update(formData, { where: { slug: user_slug } });
            if (!newUser[0] && !newUser[1][0]) {
                throw new ApiError(404, `User with slug='${user_slug}' was not found`);
            }
            return newUser[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(409, 'This email already exists');
            }
            throw err;
        }
    }

    // [PUT] /api/users/:user_slug/edit-user-security
    async updateUserSecurity(user_slug, formData) {
        try {
            const { newPassword, confirmPassword } = formData;

            if (newPassword !== confirmPassword) {
                throw new ApiError(403, 'Confirm password do not match');
            }
            const updated = await User.update({ password: confirmPassword }, { where: { slug: user_slug } });
            if (!updated[0] && !updated[1][0]) {
                throw new ApiError(404, `User with slug='${user_slug}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/users/:user_slug/ban-user
    async banUser(id, user_slug, formData) {
        try {
            const { adminPassword } = formData;
            const admin = await User.findByPk(id, { attributes: ['id', 'password'] });

            if (admin && admin.matchPassword(adminPassword)) {
                const deleted = await User.destroy({ where: { slug: user_slug } });
                if (!deleted) throw new ApiError(404, `User with slug='${user_slug}' was not found`);
            } else {
                throw new ApiError(403, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/users/get-deleted-users
    async getDeletedUser() {
        try {
            const deletedUsers = await User.findAll({
                where: { deletedAt: { [Op.not]: null } },
                paranoid: false,
                order: [['deletedAt', 'DESC']],
            });
            return deletedUsers;
        } catch (err) {
            throw err;
        }
    }

    // [PATCH] /api/users/deleted_users/restore
    async restoreUser(id, user_slug, formData) {
        try {
            const { adminPassword } = formData;
            const admin = await User.findByPk(id, { attributes: ['id', 'password'] });

            if (admin && admin.matchPassword(adminPassword)) {
                const restoredUser = await User.restore({
                    where: { slug: user_slug, deletedAt: { [Op.not]: null } },
                    paranoid: false,
                });
                if (!restoredUser) throw new ApiError(404, `User with slug='${user_slug}' was not found`);
            } else {
                throw new ApiError(403, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/users/deleted_users/force-delete-user
    async forceDeleteUser(id, user_slug, formData) {
        try {
            const { adminPassword } = formData;
            const admin = await User.findByPk(id, { attributes: ['id', 'password'] });

            if (admin && admin.matchPassword(adminPassword)) {
                const deleted = await User.destroy({
                    where: { slug: user_slug, deletedAt: { [Op.not]: null } },
                    force: true,
                });

                if (!deleted) {
                    throw new ApiError(404, `User with slug='${user_slug}' was not found`);
                }

                await cloudinary.api.delete_resources_by_prefix(`fiverr/${user_slug}/`, async (err, result) => {
                    if (Object.keys(result.deleted).length > 0) {
                        await cloudinary.api.delete_folder(`fiverr/${user_slug}`);
                    }
                });
            } else {
                throw new ApiError(403, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UsersService();
