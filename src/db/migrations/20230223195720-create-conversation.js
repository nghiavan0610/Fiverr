'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Conversations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            started_by_user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            recipient_user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Conversations');
    },
};
