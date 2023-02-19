'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class University extends Model {
        static associate(models) {
            // University.belongsToMany(models.User, {
            //     through: models.UserEducation,
            //     foreignKey: 'university_id',
            //     otherKey: 'user_id',
            //     onDelete: 'SET NULL',
            //     hooks: true,
            // });
            University.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'university_id',
            });
        }
    }
    University.init(
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
                        msg: 'Please enter the university name',
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
            modelName: 'University',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_university_name',
                    unique: true,
                    fields: ['name'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(University, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return University;
};
