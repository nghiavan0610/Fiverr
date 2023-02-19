'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Skill extends Model {
        static associate(models) {
            // Skill.belongsToMany(models.User, {
            //     through: models.UserSkill,
            //     foreignKey: 'skill_id',
            //     otherKey: 'user_id',
            // });
            Skill.hasMany(models.UserSkill, {
                sourceKey: 'id',
                foreignKey: 'skill_id',
            });
        }
    }
    Skill.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter the skill name',
                    },
                },
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Skill',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_skill_name',
                    unique: true,
                    fields: ['name'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(Skill, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return Skill;
};
