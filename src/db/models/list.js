'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class List extends Model {
        static associate(models) {
            List.belongsTo(models.User, { as: 'ListOwner', foreignKey: 'user_id' });
            // List.hasMany(models.Collection, {
            //     as: 'Collections',
            //     sourceKey: 'id',
            //     foreignKey: 'list_id',
            //     onDelete: 'CASCADE',
            //     hooks: true,
            // });

            // Polymorphic M:M
            List.belongsToMany(models.Gig, {
                as: 'CollectGigs',
                through: {
                    model: models.Collection,
                    unique: false,
                    scope: {
                        tag_type: 'GIG',
                    },
                },
                foreignKey: 'list_id',
                constraints: false,
            });
            List.belongsToMany(models.User, {
                as: 'CollectSellers',
                through: {
                    model: models.Collection,
                    unique: false,
                    scope: {
                        tag_type: 'SELLER',
                    },
                },
                foreignKey: 'list_id',
                constraints: false,
            });
        }
    }
    List.init(
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
                        msg: 'Please enter your list name',
                    },
                },
            },
            description: {
                type: DataTypes.STRING,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('description', null);
                    } else {
                        this.setDataValue('description', value);
                    }
                },
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
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'List',
            timestamps: true,
        },
    );
    // Add plugins
    SequelizeSlugify.slugifyModel(List, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return List;
};
