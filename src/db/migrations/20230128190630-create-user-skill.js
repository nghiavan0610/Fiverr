'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'UserSkills',
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
                    skill_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Skills',
                            key: 'id',
                        },
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    level: {
                        type: Sequelize.ENUM('beginner', 'intermediate', 'expert'),
                        defaultValue: 'beginner',
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('level', 'beginner');
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
                'UserSkills',
                ['user_id', 'skill_id'],
                { name: 'ix_user_skills', unique: true },
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
            await queryInterface.dropTable('UserSkills');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
