'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'UserEducations',
                {
                    id: {
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
                    university_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Universities',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    major_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Majors',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    country_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Countries',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    title_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'AcademicTitles',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    year_of_graduation: {
                        type: Sequelize.INTEGER,
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('year_of_graduation', null);
                            } else {
                                if (!value.match(/^[0-9]+$/)) {
                                    throw new ValidationError(400, 'Wrong year format');
                                }

                                if (value.length !== 4) {
                                    throw new ValidationError(400, 'Year of graduation must have 4 characters');
                                }

                                if (value > new Date().getFullYear()) {
                                    throw new ValidationError(
                                        400,
                                        'Year of graduation cannot be greater than present year',
                                    );
                                }

                                this.setDataValue('year_of_graduation', value);
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
                },
                { transaction },
            );
            await queryInterface.addIndex(
                'UserEducations',
                ['user_id', 'university_id', 'major_id', 'country_id', 'title_id'],
                { name: 'ix_user_educations', unique: true },
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
            await queryInterface.dropTable('UserEducations');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
