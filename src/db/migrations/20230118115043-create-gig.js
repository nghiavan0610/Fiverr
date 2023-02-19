'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Gigs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter your gig name',
                    },
                },
            },
            image: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            price_basic: {
                type: Sequelize.FLOAT,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('price_basic', 0);
                    } else {
                        if (typeof value !== 'number') {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('price_basic', value);
                    }
                },
            },
            about_basic: {
                type: Sequelize.STRING,
            },
            price_standard: {
                type: Sequelize.FLOAT,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('price_standard', null);
                    } else {
                        if (typeof value !== 'number') {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('price_standard', value);
                    }
                },
            },
            about_standard: {
                type: Sequelize.STRING,
            },
            price_premium: {
                type: Sequelize.FLOAT,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('price_premium', 0);
                    } else {
                        if (typeof value !== 'number') {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('price_premium', value);
                    }
                },
            },
            about_premium: {
                type: Sequelize.STRING,
            },
            seller_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            gig_service_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'GigServices',
                    key: 'id',
                },
                onDelete: 'SET NULL',
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
            deletedAt: {
                type: Sequelize.DATE,
            },
            slug: {
                type: Sequelize.STRING,
                unique: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Gigs');
    },
};
