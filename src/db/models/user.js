'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const SequelizeSlugify = require('sequelize-slugify');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        matchPassword(enterPassword) {
            return bcrypt.compareSync(enterPassword, this.password);
        }
        static associate(models) {
            User.hasMany(models.Gig, {
                as: 'Gigs',
                sourceKey: 'id',
                foreignKey: 'seller_id',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.belongsTo(models.Country, { foreignKey: 'country_id' });
            User.hasMany(models.Order, {
                as: 'Orders',
                sourceKey: 'id',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.List, {
                as: 'Lists',
                sourceKey: 'id',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                hooks: true,
            });

            // Polymorphic M:M
            // User.hasMany(models.Collection, {
            //     as: 'SellerIsCollectedBy',
            //     foreignKey: 'tag_id',
            //     constraints: false,
            //     scope: {
            //         tag_type: 'SELLER',
            //     },
            //     onDelete: 'CASCADE',
            //     hooks: true,
            // });
            User.belongsToMany(models.List, {
                as: 'SellersIsCollectedBy',
                through: {
                    model: models.Collection,
                    unique: false,
                    scope: {
                        tag_type: 'SELLER',
                    },
                },
                foreignKey: 'tag_id',
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });

            User.hasMany(models.Review, {
                as: 'Reviews',
                sourceKey: 'id',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.Review, {
                as: 'ReviewBody',
                foreignKey: 'tag_id',
                scope: {
                    tag_type: 'SELLER',
                },
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserLanguage, {
                sourceKey: 'id',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserSkill, {
                sourceKey: 'id',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserCertification, {
                sourceKey: 'id',
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                hooks: true,
            });
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter your username',
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                // allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: 'Invalid Email Address',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                // allowNull: false,
                set(value) {
                    if (value.length >= 8 && value.length <= 20) {
                        const hashedPassword = bcrypt.hashSync(value, 10);
                        this.setDataValue('password', hashedPassword);
                    } else {
                        throw new ValidationError(400, 'Your password should be between 8-20 characters!');
                    }
                },
            },
            birthday: {
                type: DataTypes.DATEONLY,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('birthday', null);
                    } else {
                        if (!value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)) {
                            throw new ValidationError(400, 'Wrong date format');
                        }
                        if (
                            new Date(value).getFullYear() < 1960 ||
                            new Date(value).getFullYear() > new Date().getFullYear()
                        ) {
                            throw new ValidationError(
                                400,
                                'Your birthday cannot be greater than present year and must be greater than 1960',
                            );
                        }

                        this.setDataValue('birthday', value);
                    }
                },
            },
            gender: {
                type: DataTypes.ENUM('none', 'male', 'female', 'other'),
                defaultValue: 'none',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('gender', 'none');
                    } else {
                        this.setDataValue('gender', value);
                    }
                },
            },
            country_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Country',
                    key: 'id',
                },
            },
            about: {
                type: DataTypes.STRING,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('about', null);
                    } else {
                        this.setDataValue('about', value);
                    }
                },
            },
            phone: {
                type: DataTypes.STRING,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('phone', null);
                    } else {
                        if (!value.match(/^[0-9]+$/)) {
                            throw new ValidationError(400, 'Wrong phone number format');
                        }

                        if (value.length !== 10) {
                            throw new ValidationError(400, 'Your phone number must have 10 characters');
                        }

                        this.setDataValue('phone', value);
                    }
                },
            },
            role: {
                type: DataTypes.ENUM('user', 'seller', 'admin'),
                defaultValue: 'user',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('role', 'user');
                    } else {
                        this.setDataValue('role', value);
                    }
                },
            },
            avatarUrl: DataTypes.STRING,
            facebook_id: DataTypes.STRING,
            google_id: DataTypes.STRING,
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
            defaultScope: {
                attributes: {
                    exclude: ['password'],
                },
            },
            timestamps: true,
            createdAt: 'member_since',
            paranoid: true,
            hooks: {
                afterSave: (record) => {
                    delete record.dataValues.password;
                },
            },
            indexes: [
                {
                    name: 'ix_user_email',
                    unique: true,
                    fields: ['email'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(User, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return User;
};
