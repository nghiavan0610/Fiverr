'use strict';
const { Model, Op } = require('sequelize');
// const { Conversation, User } = require('./index');
const { ValidationError } = require('../../helpers/ErrorHandler');

module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            // Skill.belongsToMany(models.User, {
            //     through: models.UserSkill,
            //     foreignKey: 'skill_id',
            //     otherKey: 'user_id',
            // });
            // Skill.hasMany(models.UserSkill, {
            //     sourceKey: 'id',
            //     foreignKey: 'skill_id',
            // });
            Message.belongsTo(models.User, {
                as: 'SenderUser',
                foreignKey: 'sender_id',
            });
            Message.belongsTo(models.Conversation, {
                as: 'MessageOfConversation',
                foreignKey: 'conversation_id',
            });
        }
    }
    Message.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sender_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            conversation_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Conversation',
                    key: 'id',
                },
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Message',
            timestamps: true,
        },
    );
    Message.beforeCreate(async (message, options) => {
        const Conversation = sequelize.models.Conversation;
        const User = sequelize.models.User;
        const conversation = await Conversation.findByPk(message.conversation_id, {
            // include: [
            //     {
            //         model: User,
            //         as: 'StartedByUser',
            //     },
            //     {
            //         model: User,
            //         as: 'RecipientUser',
            //     },
            // ],
        });

        message.sender_id =
            conversation.started_by_user_id === message.sender_id
                ? conversation.started_by_user_id
                : conversation.recipient_user_id === message.sender_id
                ? conversation.recipient_user_id
                : null;

        if (!message.sender_id) {
            throw new ValidationError(400, 'Sender does not belong to the conversation');
        }
    });

    // Auto delete older message
    const max_age = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    setInterval(async () => {
        const oldestDate = new Date(Date.now() - max_age);
        const messagesToDelete = await Message.findAll({
            where: {
                createdAt: {
                    [Op.lt]: oldestDate,
                },
            },
        });
        messagesToDelete.forEach(async (message) => {
            await message.destroy();
        });
    }, 24 * 60 * 60 * 1000);

    return Message;
};
