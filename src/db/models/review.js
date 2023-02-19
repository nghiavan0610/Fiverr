'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { as: 'ReviewOwner', foreignKey: 'user_id' });
            Review.belongsTo(models.Gig, { as: 'ReviewGig', foreignKey: 'tag_id' });
            Review.belongsTo(models.User, { as: 'ReviewSeller', foreignKey: 'tag_id' });
        }
    }
    Review.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            tag_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            content: DataTypes.STRING,
            rating: {
                type: DataTypes.INTEGER,
                set(value) {
                    if (!value || value === 'null') {
                        throw new ValidationError(400, 'Please rate 1 to 5 stars according to your opinion');
                    } else {
                        if (parseInt(value) < 1 || parseInt(value) > 5) {
                            throw new ValidationError(400, 'Rating must be between 1 and 5');
                        }

                        this.setDataValue('rating', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'Review',
            timestamps: true,
            createdAt: 'review_date',
            indexes: [
                {
                    name: 'ix_reviews',
                    unique: true,
                    fields: ['user_id', 'tag_id', 'tag_type'],
                    where: { tag_type: 'GIG' || 'SELLER' },
                },
            ],
        },
    );
    return Review;
};
