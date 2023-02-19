'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Collections',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    list_id: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Lists',
                            key: 'id',
                        },
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tag_id: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        references: null,
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tag_type: {
                        type: Sequelize.ENUM('GIG', 'SELLER'),
                        validate: {
                            isIn: {
                                args: [['GIG', 'SELLER']],
                                msg: 'Unknown item type',
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
                },
                { transaction },
            );
            await queryInterface.addIndex(
                'Collections',
                ['list_id', 'tag_id', 'tag_type'],
                { name: 'ix_collections', unique: true, where: { tag_type: 'GIG' || 'SELLER' } },
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
            await queryInterface.dropTable('Collections');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
