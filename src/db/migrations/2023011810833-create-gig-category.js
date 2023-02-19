'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'GigCategories',
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
                                msg: 'Please enter the gig category name',
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
                    slug: {
                        unique: true,
                        type: Sequelize.STRING,
                    },
                },
                { transaction },
            );
            await queryInterface.addIndex(
                'GigCategories',
                ['name'],
                { name: 'ix_gig_category_name', unique: true },
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
            await queryInterface.dropTable('GigCategories');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
