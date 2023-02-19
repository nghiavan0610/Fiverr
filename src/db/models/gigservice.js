'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class GigService extends Model {
        static associate(models) {
            GigService.hasMany(models.Gig, {
                sourceKey: 'id',
                foreignKey: 'gig_service_id',
            });
            GigService.belongsTo(models.GigSubCategory, { foreignKey: 'gig_sub_category_id' });
        }
    }
    GigService.init(
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
                        msg: 'Please enter the gig service name',
                    },
                },
            },
            gig_sub_category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'GigSubCategory',
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
            modelName: 'GigService',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_gig_service',
                    unique: true,
                    fields: ['name', 'gig_sub_category_id'],
                },
            ],
        },
    );
    // Add plugins
    SequelizeSlugify.slugifyModel(GigService, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return GigService;
};
