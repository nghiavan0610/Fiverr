'use strict';
const { validate } = require('express-validation');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserLanguage extends Model {
        static associate(models) {
            UserLanguage.belongsTo(models.User, { foreignKey: 'user_id' });
            UserLanguage.belongsTo(models.Language, { foreignKey: 'language_id' });
        }
    }
    UserLanguage.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            language_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Language',
                    key: 'id',
                },
            },
            level: {
                type: DataTypes.ENUM('basic', 'conversational', 'fluent', 'native'),
                defaultValue: 'basic',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('level', 'basic');
                    } else {
                        this.setDataValue('level', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'UserLanguage',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_user_languages',
                    unique: true,
                    fields: ['user_id', 'language_id'],
                },
            ],
        },
    );
    return UserLanguage;
};
