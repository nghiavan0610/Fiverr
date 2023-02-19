'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'UserLanguages',
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
                    language_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Languages',
                            key: 'id',
                        },
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    level: {
                        type: Sequelize.ENUM('basic', 'conversational', 'fluent', 'native'),
                        defaultValue: 'basic',
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('level', 'basic');
                            } else {
                                this.setDataValue('level', value);
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
                'UserLanguages',
                ['user_id', 'language_id'],
                { name: 'ix_user_languages', unique: true },
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
            await queryInterface.dropTable('UserLanguages');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
