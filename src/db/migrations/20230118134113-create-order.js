'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
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
                onDelete: 'CASCADE',
                hooks: true,
            },
            gig_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                references: {
                    model: 'Gigs',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            package: {
                type: Sequelize.ENUM('basic', 'standard', 'premium'),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['basic', 'standard', 'premium']],
                        msg: 'Unknown package type',
                    },
                },
            },
            is_done: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            order_date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Orders');
    },
};
