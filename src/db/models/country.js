'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Country extends Model {
        static associate(models) {
            // Country.belongsToMany(models.User, {
            //     through: models.UserEducation,
            //     foreignKey: 'country_id',
            //     otherKey: 'user_id',
            //     onDelete: 'SET NULL',
            //     hooks: true,
            // });
            Country.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'country_id',
            });
            Country.hasMany(models.User, {
                sourceKey: 'id',
                foreignKey: 'country_id',
            });
        }
    }
    Country.init(
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
                        msg: 'Please enter the country name',
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
            modelName: 'Country',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_country_name',
                    unique: true,
                    fields: ['name'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(Country, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return Country;
};
