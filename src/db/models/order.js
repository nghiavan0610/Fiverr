'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                as: 'OrderOwner',
                foreignKey: 'user_id',
                // onDelete: 'RESTRICT',
                // hooks: true,
            });
            Order.belongsTo(models.Gig, {
                as: 'GigIsOrdered',
                foreignKey: 'gig_id',
                // onDelete: 'RESTRICT',
                // hooks: true,
            });
        }
    }
    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            gig_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'Gig',
                    key: 'id',
                },
            },
            package: {
                type: DataTypes.ENUM('basic', 'standard', 'premium'),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['basic', 'standard', 'premium']],
                        msg: 'Unknown package type',
                    },
                },
            },
            is_done: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('is_done', false);
                    } else {
                        this.setDataValue('is_done', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'Order',
            timestamps: true,
            createdAt: 'order_date',
            paranoid: true,
        },
    );
    return Order;
};
