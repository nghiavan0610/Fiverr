'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'UserCertifications',
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
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    certificated_from: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    year_of_certification: {
                        type: Sequelize.INTEGER,
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('year_of_certification', null);
                            } else {
                                if (!value.match(/^[0-9]+$/)) {
                                    throw new ValidationError(400, 'Wrong year format');
                                }

                                if (value.length !== 4) {
                                    throw new ValidationError(400, 'Year of certification must have 4 characters');
                                }

                                if (value > new Date().getFullYear()) {
                                    throw new ValidationError(
                                        400,
                                        'Year of certification cannot be greater than present year',
                                    );
                                }

                                this.setDataValue('year_of_certification', value);
                            }
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
                'UserCertifications',
                ['user_id', 'name', 'certificated_from'],
                { name: 'ix_user_certifications', unique: true },
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
            await queryInterface.dropTable('UserCertifications');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
