'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class UserEducation extends Model {
        static associate(models) {
            UserEducation.belongsTo(models.User, { foreignKey: 'user_id' });
            UserEducation.belongsTo(models.University, { foreignKey: 'university_id' });
            UserEducation.belongsTo(models.Major, { foreignKey: 'major_id' });
            UserEducation.belongsTo(models.Country, { foreignKey: 'country_id' });
            UserEducation.belongsTo(models.AcademicTitle, { foreignKey: 'title_id' });
        }
    }
    UserEducation.init(
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
            university_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'University',
                    key: 'id',
                },
            },
            major_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Major',
                    key: 'id',
                },
            },
            country_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Country',
                    key: 'id',
                },
            },
            title_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'AcademicTitle',
                    key: 'id',
                },
            },
            year_of_graduation: {
                type: DataTypes.INTEGER,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('year_of_graduation', null);
                    } else {
                        if (!value.match(/^[0-9]+$/)) {
                            throw new ValidationError(400, 'Wrong year format');
                        }

                        if (value.length !== 4) {
                            throw new ValidationError(400, 'Year of graduation must have 4 characters');
                        }

                        if (value > new Date().getFullYear()) {
                            throw new ValidationError(400, 'Year of graduation cannot be greater than present year');
                        }

                        this.setDataValue('year_of_graduation', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'UserEducation',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_user_educations',
                    unique: true,
                    fields: ['user_id', 'university_id', 'major_id', 'country_id', 'title_id'],
                },
            ],
        },
    );
    return UserEducation;
};
