'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class GigSubCategory extends Model {
        static associate(models) {
            GigSubCategory.hasMany(models.GigService, {
                sourceKey: 'id',
                foreignKey: 'gig_sub_category_id',
            });
            GigSubCategory.belongsTo(models.GigCategory, { foreignKey: 'gig_category_id' });
        }
    }
    GigSubCategory.init(
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
                        msg: 'Please enter the gig sub-category name',
                    },
                },
            },
            gig_category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'GigCategory',
                    key: 'id',
                },
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'GigSubCategory',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_gig_sub_category',
                    unique: true,
                    fields: ['name', 'gig_category_id'],
                },
            ],
        },
    );
    // Add plugins
    SequelizeSlugify.slugifyModel(GigSubCategory, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return GigSubCategory;
};
