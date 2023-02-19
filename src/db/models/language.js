'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Language extends Model {
        static associate(models) {
            // Language.belongsToMany(models.User, {
            //     through: models.UserLanguage,
            //     foreignKey: 'language_id',
            //     otherKey: 'user_id',
            // });
            Language.hasMany(models.UserLanguage, {
                sourceKey: 'id',
                foreignKey: 'language_id',
            });
        }
    }
    Language.init(
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
                        msg: 'Please enter the language name',
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
            modelName: 'Language',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_language_name',
                    unique: true,
                    fields: ['name'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(Language, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return Language;
};
