'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Messages', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            sender_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            conversation_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Conversations',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
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
        await queryInterface.dropTable('Messages');
    },
};
