'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Users',
                {
                    id: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        primaryKey: true,
                    },
                    name: {
                        allowNull: false,
                        type: Sequelize.STRING,
                        validate: {
                            notEmpty: {
                                msg: 'Please enter your username',
                            },
                        },
                    },
                    email: {
                        allowNull: false,
                        type: Sequelize.STRING,
                        validate: {
                            isEmail: {
                                msg: 'Invalid Email Address',
                            },
                        },
                    },
                    password: {
                        allowNull: false,
                        type: Sequelize.STRING,
                        set(value) {
                            if (value.length >= 8 && value.length <= 20) {
                                const hashedPassword = bcrypt.hashSync(value, 10);
                                this.setDataValue('password', hashedPassword);
                            } else {
                                throw new ValidationError(400, 'Your password should be between 8-20 characters!');
                            }
                        },
                    },
                    member_since: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    deletedAt: {
                        type: Sequelize.DATE,
                    },
                    birthday: {
                        type: Sequelize.DATEONLY,
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('birthday', null);
                            } else {
                                if (!value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)) {
                                    throw new ValidationError(400, 'Wrong date format');
                                }

                                this.setDataValue('birthday', value);
                            }
                        },
                    },
                    gender: {
                        type: Sequelize.ENUM('none', 'male', 'female', 'other'),
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
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Countries',
                            key: 'id',
                        },
                    },
                    about: {
                        type: Sequelize.STRING,
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('about', null);
                            } else {
                                this.setDataValue('about', value);
                            }
                        },
                    },
                    phone: {
                        type: Sequelize.STRING,
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
                        type: Sequelize.ENUM('user', 'seller', 'admin'),
                        defaultValue: 'user',
                        set(value) {
                            if (!value || value === 'null') {
                                this.setDataValue('role', 'user');
                            } else {
                                this.setDataValue('role', value);
                            }
                        },
                    },
                    avatarUrl: {
                        type: Sequelize.STRING,
                    },
                    slug: {
                        type: Sequelize.STRING,
                        unique: true,
                    },
                },
                { transaction },
            );
            await queryInterface.addIndex('Users', ['email'], { name: 'ix_user_email', unique: true }, { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable('Users');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
