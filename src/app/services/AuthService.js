const { ApiError } = require('../../helpers/ErrorHandler');
const {
    User,
    Language,
    Skill,
    UserLanguage,
    UserSkill,
    UserCertification,
    UserEducation,
    University,
    Major,
    Country,
    AcademicTitle,
} = require('../../db/models');
const { generateToken } = require('../../helpers/Token');

class AuthService {
    // [POST] /api/auth/signin
    async signin(credentials) {
        try {
            const { email, password } = credentials;
            const user = await User.findOne({
                attributes: {
                    include: ['password'],
                },
                where: { email },
            });

            if (user && user.matchPassword(password)) {
                delete user.dataValues.password;
                const accessToken = await generateToken({ id: user.id });
                return accessToken;
            } else {
                throw new ApiError(404, 'Invalid email or password');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/auth/signup
    async signup(registration) {
        try {
            const { email } = registration;
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                throw new ApiError(409, 'Email already exists');
            }

            const user = await User.create(registration);
            const accessToken = generateToken({ id: user.id });
            return accessToken;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/auth/account
    async getAccount(id) {
        try {
            const account = await User.findByPk(id, {
                include: [
                    {
                        attributes: ['id', 'name'],
                        model: Country,
                    },
                    {
                        attributes: ['id', 'level'],
                        model: UserLanguage,
                        include: {
                            attributes: ['id', 'name', 'slug'],
                            model: Language,
                        },
                    },
                    {
                        attributes: ['id', 'level'],
                        model: UserSkill,
                        include: {
                            attributes: ['id', 'name', 'slug'],
                            model: Skill,
                        },
                    },
                    {
                        attributes: ['id', 'year_of_graduation'],
                        model: UserEducation,
                        include: [
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: Country,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: University,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: Major,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: AcademicTitle,
                            },
                        ],
                    },
                    {
                        attributes: ['id', 'name', 'certificated_from', 'year_of_certification', 'slug'],
                        model: UserCertification,
                    },
                ],
            });
            return account;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AuthService();
