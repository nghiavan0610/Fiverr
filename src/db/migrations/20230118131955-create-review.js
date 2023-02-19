'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Reviews',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    user_id: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        references: {
                            model: 'Users',
                            key: 'id',
                        },
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tag_id: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tag_type: {
                        type: Sequelize.ENUM('GIG', 'SELLER'),
                        validate: {
                            isIn: {
                                args: [['GIG', 'SELLER']],
                                msg: 'Unknown item type',
                            },
                        },
                    },
                    content: {
                        type: Sequelize.STRING,
                    },
                    rating: {
                        type: Sequelize.INTEGER,
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('rating', null);
                            } else {
                                if (parseInt(value) < 1 || parseInt(value) > 5) {
                                    throw new ValidationError(400, 'Rating must be between 1 and 5');
                                }

                                this.setDataValue('rating', value);
                            }
                        },
                    },
                    review_date: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                },
                { transaction },
            );
            await queryInterface.addIndex(
                'Reviews',
                ['user_id', 'tag_id', 'tag_type'],
                { name: 'ix_reviews', unique: true, where: { tag_type: 'GIG' || 'SELLER' } },
                { transaction },
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable('Reviews');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
