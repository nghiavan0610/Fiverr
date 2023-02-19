const { ApiError } = require('../../helpers/ErrorHandler');
const { sequelize, User, Gig, List, Country } = require('../../db/models');

class ListsService {
    // [GET] /api/lists
    async getAllAccountLists(id) {
        try {
            const lists = await List.findAll({
                attributes: [
                    'id',
                    'name',
                    'description',
                    'slug',
                    [
                        sequelize.literal(
                            `(select count(*) from Collections where Collections.list_id = List.id and Collections.tag_type = "GIG")`,
                        ),
                        'total_gigs',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Collections where Collections.list_id = List.id and Collections.tag_type = "SELLER")`,
                        ),
                        'total_sellers',
                    ],
                ],
                include: [
                    {
                        attributes: ['id', 'image'],
                        model: Gig,
                        as: 'CollectGigs',
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        attributes: ['id', 'avatarUrl'],
                        model: User,
                        as: 'CollectSellers',
                        through: {
                            attributes: [],
                        },
                    },
                ],
                where: { user_id: id },
            });
            return lists;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/lists/:list_id
    async getListById(id, list_id) {
        try {
            const list = await List.findOne({
                attributes: {
                    include: [
                        [
                            sequelize.literal(
                                `(select count(*) from Collections where Collections.list_id = List.id and Collections.tag_type = "GIG")`,
                            ),
                            'total_gigs',
                        ],
                        [
                            sequelize.literal(
                                `(select count(*) from Collections where Collections.list_id = List.id and Collections.tag_type = "SELLER")`,
                            ),
                            'total_sellers',
                        ],
                    ],
                },
                include: [
                    {
                        attributes: [
                            'id',
                            'name',
                            'image',
                            'price_basic',
                            'slug',
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tag_id = CollectGigs.id and Reviews.tag_type = "GIG")`,
                                ),
                                'gig_review_rating',
                            ],
                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tag_id = CollectGigs.id and Reviews.tag_type = "GIG")`,
                                ),
                                'gig_review_count',
                            ],
                        ],
                        model: Gig,
                        as: 'CollectGigs',
                        through: {
                            attributes: [],
                        },
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
                        attributes: [
                            'id',
                            'name',
                            'avatarUrl',
                            'slug',
                            'member_since',
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tag_id = CollectSellers.id and Reviews.tag_type = "SELLER")`,
                                ),
                                'seller_review_rating',
                            ],
                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tag_id = CollectSellers.id and Reviews.tag_type = "SELLER")`,
                                ),
                                'seller_review_count',
                            ],
                        ],
                        model: User,
                        as: 'CollectSellers',
                        through: {
                            attributes: [],
                        },
                        include: {
                            attributes: ['id', 'name'],
                            model: Country,
                        },
                    },
                ],
                where: { id: list_id, user_id: id },
            });
            if (!list) {
                throw new ApiError(404, `List with id='${list_id}' was not found or not your list`);
            }
            return list;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/lists/create-list
    async createList(id, formData) {
        try {
            const { list_name, list_description } = formData;
            const newList = await List.create({
                name: list_name,
                description: list_description,
                user_id: id,
            });
            return newList;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/lists/:list_id
    async editList(id, list_id, formData) {
        try {
            const { list_name, list_description } = formData;
            const newList = await List.update(
                {
                    name: list_name,
                    description: list_description,
                },
                { where: { id: list_id, user_id: id } },
            );
            if (!newList[0] && !newList[1][0]) {
                throw new ApiError(404, `List with id='${list_id}' was not found or not your list`);
            }
            return newList[1][0];
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/lists/:list_id
    async deleteList(id, list_id) {
        try {
            const deleted = await List.destroy({ where: { id: list_id, user_id: id } });
            if (!deleted) {
                throw new ApiError(404, `List with id='${list_id}' was not found or not your list`);
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new ListsService();
