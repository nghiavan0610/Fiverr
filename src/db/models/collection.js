'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');

const uppercaseFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`;

module.exports = (sequelize, DataTypes) => {
    class Collection extends Model {
        static associate(models) {
            // Collection.belongsTo(models.List, { as: 'CollectionOfList', foreignKey: 'list_id' });
            // Collection.belongsTo(models.Gig, {
            //     as: 'CollectGig',
            //     foreignKey: 'tag_id',
            //     constraints: false,
            // });
            // Collection.belongsTo(models.User, {
            //     as: 'CollectSeller',
            //     foreignKey: 'tag_id',
            //     constraints: false,
            // });

            Collection.belongsTo(models.List, { foreignKey: 'list_id', constraints: false });
            Collection.belongsTo(models.User, { foreignKey: 'tag_id', constraints: false });
            Collection.belongsTo(models.Gig, { foreignKey: 'tag_id', constraints: false });
        }
    }
    Collection.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            list_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'List',
                    key: 'id',
                },
            },
            tag_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                references: null,
            },
            tag_type: {
                type: DataTypes.ENUM('GIG', 'SELLER'),
                validate: {
                    isIn: {
                        args: [['GIG', 'SELLER']],
                        msg: 'Unknown item type',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'Collection',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_collections',
                    unique: true,
                    fields: ['list_id', 'tag_id', 'tag_type'],
                    where: { tag_type: 'GIG' || 'SELLER' },
                },
            ],
        },
    );
    return Collection;
};
