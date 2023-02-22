'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                queryInterface.addColumn(
                    'Users',
                    'facebook_id',
                    {
                        type: Sequelize.STRING,
                    },
                    { transaction },
                ),
                queryInterface.addColumn(
                    'Users',
                    'google_id',
                    {
                        type: Sequelize.STRING,
                    },
                    { transaction },
                ),
            ]);
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                queryInterface.removeColumn('Users', 'facebook_id', { transaction }),
                queryInterface.removeColumn('Users', 'google_id', { transaction }),
            ]);
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
