'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'GigSubCategories',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        validate: {
                            notEmpty: {
                                msg: 'Please enter the gig sub-category name',
                            },
                        },
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    gig_category_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'GigCategories',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    slug: {
                        unique: true,
                        type: Sequelize.STRING,
                    },
                },
                { transaction },
            );
            await queryInterface.addIndex(
                'GigSubCategories',
                ['name', 'gig_category_id'],
                { name: 'ix_gig_sub_category', unique: true },
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
            await queryInterface.dropTable('GigSubCategories');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
