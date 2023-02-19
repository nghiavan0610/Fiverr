'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class UserSkill extends Model {
        static associate(models) {
            UserSkill.belongsTo(models.User, { foreignKey: 'user_id' });
            UserSkill.belongsTo(models.Skill, { foreignKey: 'skill_id' });
        }
    }
    UserSkill.init(
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
            skill_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Skill',
                    key: 'id',
                },
            },
            level: {
                type: DataTypes.ENUM('beginner', 'intermediate', 'expert'),
                defaultValue: 'beginner',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('level', 'beginner');
                    } else {
                        this.setDataValue('level', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'UserSkill',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_user_skills',
                    unique: true,
                    fields: ['user_id', 'skill_id'],
                },
            ],
        },
    );
    return UserSkill;
};
