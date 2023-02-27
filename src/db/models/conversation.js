'use strict';
const { Model, Op } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        static associate(models) {
            Conversation.belongsTo(models.User, {
                as: 'StartedByUser',
                foreignKey: 'started_by_user_id',
            });
            Conversation.belongsTo(models.User, {
                as: 'RecipientUser',
                foreignKey: 'recipient_user_id',
            });
            Conversation.hasMany(models.Message, {
                as: 'Messages',
                sourceKey: 'id',
                foreignKey: 'conversation_id',
            });
        }
    }
    Conversation.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            started_by_user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    // as: 'StartedByUser',
                    model: 'User',
                    key: 'id',
                },
            },
            recipient_user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    // as: 'RecipientUser',
                    model: 'User',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Conversation',
            timestamps: true,
        },
    );
    return Conversation;
};
