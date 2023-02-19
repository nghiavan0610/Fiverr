'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class GigCategory extends Model {
        static associate(models) {
            GigCategory.hasMany(models.GigSubCategory, {
                sourceKey: 'id',
                foreignKey: 'gig_category_id',
            });
        }
    }
    GigCategory.init(
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
                        msg: 'Please enter the gig category name',
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
            modelName: 'GigCategory',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_gig_category_name',
                    unique: true,
                    fields: ['name'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(GigCategory, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return GigCategory;
};
