'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Major extends Model {
        static associate(models) {
            // Major.belongsToMany(models.User, {
            //     through: models.UserEducation,
            //     foreignKey: 'major_id',
            //     otherKey: 'user_id',
            //     onDelete: 'SET NULL',
            //     hooks: true,
            // });
            Major.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'major_id',
            });
        }
    }
    Major.init(
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
                        msg: 'Please enter the major name',
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
            modelName: 'Major',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_major_name',
                    unique: true,
                    fields: ['name'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(Major, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return Major;
};
