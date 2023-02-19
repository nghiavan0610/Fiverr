'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Countries',
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
                                msg: 'Please enter the country name',
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
                        type: Sequelize.STRING,
                        unique: true,
                    },
                },
                { transaction },
            );
            await queryInterface.addIndex(
                'Countries',
                ['name'],
                { name: 'ix_country_name', unique: true },
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
            await queryInterface.dropTable('Countries');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
