'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
const { ValidationError } = require('../../helpers/ErrorHandler');

module.exports = (sequelize, DataTypes) => {
    class Gig extends Model {
        static associate(models) {
            Gig.belongsTo(models.User, { as: 'GigOwner', foreignKey: 'seller_id' });
            Gig.belongsTo(models.GigService, { foreignKey: 'gig_service_id' });
            Gig.hasMany(models.Order, {
                as: 'GigIsOrderedBy',
                sourceKey: 'id',
                foreignKey: 'gig_id',
                onDelete: 'CASCADE',
                hooks: true,
            });

            // Polymorphic M:M
            // Gig.hasMany(models.Collection, {
            //     as: 'GigIsCollectedBy',
            //     foreignKey: 'tag_id',
            //     constraints: false,
            //     scope: {
            //         tag_type: 'GIG',
            //     },
            //     onDelete: 'CASCADE',
            //     hooks: true,
            // });
            Gig.belongsToMany(models.List, {
                as: 'GigsIsCollectedBy',
                through: {
                    model: models.Collection,
                    unique: false,
                    scope: {
                        tag_type: 'GIG',
                    },
                },
                foreignKey: 'tag_id',
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });

            Gig.hasMany(models.Review, {
                as: 'ReviewBody',
                foreignKey: 'tag_id',
                scope: {
                    tag_type: 'GIG',
                },
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });
        }
    }
    Gig.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Please enter your gig name',
                    },
                },
            },
            image: DataTypes.STRING,
            description: DataTypes.STRING,
            price_basic: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('price_basic', 0);
                    } else {
                        if (!parseFloat(value)) {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('price_basic', parseFloat(value));
                    }
                },
            },
            about_basic: DataTypes.STRING,
            price_standard: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('price_standard', null);
                    } else {
                        if (!parseFloat(value)) {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('price_standard', parseFloat(value));
                    }
                },
            },
            about_standard: DataTypes.STRING,
            price_premium: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('price_premium', null);
                    } else {
                        if (!parseFloat(value)) {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('price_premium', parseFloat(value));
                    }
                },
            },
            about_premium: DataTypes.STRING,
            seller_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            gig_service_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'GigService',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Gig',
            timestamps: true,
            paranoid: true,
        },
    );
    // Add plugins
    SequelizeSlugify.slugifyModel(Gig, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });

    return Gig;
};
