const { ApiError } = require('../../helpers/ErrorHandler');
const {
    User,
    Language,
    UserLanguage,
    Skill,
    UserSkill,
    University,
    Major,
    Country,
    AcademicTitle,
    UserEducation,
    UserCertification,
} = require('../../db/models');
const cloudinary = require('cloudinary').v2;

class ProfileService {
    // [PUT] /api/profile/upload-avatar
    async uploadAvatar(id, avatarUrl) {
        try {
            const user = await User.findOne({
                where: { id },
            });

            if (user.avatarUrl) {
                const decodedUrl = decodeURI(user.avatarUrl);
                const imageFileName = decodedUrl.split('/').slice(-3).join('/').replace('.jpg', '');

                await cloudinary.uploader.destroy(imageFileName);
            }

            const newAvatar = await user.update({ avatarUrl });
            return newAvatar.avatarUrl;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/profile/overview
    async updateUserDescription(id, about) {
        try {
            const user = await User.update({ about }, { where: { id } });
            const newDescription = user[1][0].about;
            return newDescription;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/profile/languages/create
    async createUserLanguage(id, formData) {
        try {
            const { language_name, level } = formData;
            const language = await Language.findOne({ attributes: ['id'], where: { name: language_name } });
            if (!language) {
                throw new ApiError(404, `Language '${language_name}' was not found`);
            }

            const [newLanguage, created] = await UserLanguage.findOrCreate({
                where: {
                    user_id: id,
                    language_id: language.id,
                },
                defaults: { level },
            });

            if (!created) {
                await newLanguage.update({ level });
            }
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/profile/languages/edit
    async updateUserLanguage(id, formData) {
        try {
            const { user_language_id, language_name, level } = formData;
            const language = await Language.findOne({ attributes: ['id'], where: { name: language_name } });
            if (!language) {
                throw new ApiError(404, `Language '${language_name}' was not found`);
            }

            const updated = await UserLanguage.update(
                {
                    language_id: language.id,
                    level,
                },
                { where: { id: user_language_id, user_id: id } },
            );
            if (!updated[0]) {
                throw new ApiError(404, 'You do not have this language to edit');
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This language already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/profile/languages/delete
    async deleteUserLanguage(id, user_language_id) {
        try {
            const deleted = await UserLanguage.destroy({
                where: { id: user_language_id, user_id: id },
                force: true,
            });

            if (!deleted) {
                throw new ApiError(404, 'You do not have this language to delete');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/profile/skills/create
    async createUserSkill(id, formData) {
        try {
            const { skill_name, level } = formData;
            const skill = await Skill.findOne({ where: { name: skill_name } });
            if (!skill) {
                throw new ApiError(404, `Skill '${skill_name}' was not found`);
            }

            const [newSkill, created] = await UserSkill.findOrCreate({
                where: {
                    user_id: id,
                    skill_id: skill.id,
                },
                defaults: { level },
            });

            if (!created) {
                await newSkill.update({ level });
            }
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/profile/skills/edit
    async updateUserSkill(id, formData) {
        try {
            const { user_skill_id, skill_name, level } = formData;
            const skill = await Skill.findOne({ attributes: ['id'], where: { name: skill_name } });
            if (!skill) {
                throw new ApiError(404, `Skill '${skill_name}' was not found`);
            }

            const updated = await UserSkill.update(
                {
                    skill_id: skill.id,
                    level,
                },
                { where: { id: user_skill_id, user_id: id } },
            );
            if (!updated[0]) {
                throw new ApiError(404, 'You do not have this skill to edit');
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This skill already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/profile/skills/delete
    async deleteUserSkill(id, user_skill_id) {
        try {
            const deleted = await UserSkill.destroy({
                where: { id: user_skill_id, user_id: id },
                force: true,
            });

            if (!deleted) {
                throw new ApiError(404, 'You do not have this skill to delete');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/profile/education/create
    async createUserEducation(id, formData) {
        try {
            const { university_name, major_name, country_name, academic_title, year_of_graduation } = formData;
            const [university, major, country, title] = await Promise.all([
                University.findOne({ where: { name: university_name } }),
                Major.findOne({ where: { name: major_name } }),
                Country.findOne({ where: { name: country_name } }),
                AcademicTitle.findOne({ where: { name: academic_title } }),
            ]);

            if (!university) {
                throw new ApiError(404, `University '${university_name}' was not found`);
            }
            if (!major) {
                throw new ApiError(404, `Major '${major_name}' was not found`);
            }
            if (!country) {
                throw new ApiError(404, `Country '${country_name}' was not found`);
            }
            if (!title) {
                throw new ApiError(404, `Title '${academic_title}' was not found`);
            }

            const [newEducation, created] = await UserEducation.findOrCreate({
                where: {
                    user_id: id,
                    university_id: university.id,
                    major_id: major.id,
                    country_id: country.id,
                    title_id: title.id,
                },
                defaults: { year_of_graduation },
            });

            if (!created) {
                await newEducation.update({ year_of_graduation });
            }
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/profile/education/edit
    async updateUserEducation(id, formData) {
        try {
            const { education_id, university_name, major_name, country_name, academic_title, year_of_graduation } =
                formData;
            const [university, major, country, title] = await Promise.all([
                University.findOne({ where: { name: university_name } }),
                Major.findOne({ where: { name: major_name } }),
                Country.findOne({ where: { name: country_name } }),
                AcademicTitle.findOne({ where: { name: academic_title } }),
            ]);

            if (!university) {
                throw new ApiError(404, `University '${university_name}' was not found`);
            }
            if (!major) {
                throw new ApiError(404, `Major '${major_name}' was not found`);
            }
            if (!country) {
                throw new ApiError(404, `Country '${country_name}' was not found`);
            }
            if (!title) {
                throw new ApiError(404, `Title '${academic_title}' was not found`);
            }

            const updated = await UserEducation.update(
                {
                    university_id: university.id,
                    major_id: major.id,
                    country_id: country.id,
                    title_id: title.id,
                    year_of_graduation,
                },
                { where: { id: education_id, user_id: id } },
            );
            if (!updated[0]) {
                throw new ApiError(404, 'This is not your education profile to edit');
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This education profile already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/profile/education/delete
    async deleteUserEducation(id, education_id) {
        try {
            const deleted = await UserEducation.destroy({
                where: { id: education_id, user_id: id },
                force: true,
            });

            if (!deleted) {
                throw new ApiError(404, 'This is not your education profile to delete');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/profile/certification/create
    async createUserCertification(id, formData) {
        try {
            const { certification_name, certificated_from, year_of_certification } = formData;
            const [newCertification, created] = await UserCertification.findOrCreate({
                where: {
                    user_id: id,
                    name: certification_name,
                    certificated_from,
                },
                defaults: { year_of_certification },
            });

            if (!created) {
                await newCertification.update({ year_of_certification });
            }
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/profile/certification/edit
    async updateUserCertification(id, formData) {
        try {
            const { certification_id, certification_name, certificated_from, year_of_certification } = formData;
            const updated = await UserCertification.update(
                {
                    name: certification_name,
                    certificated_from,
                    year_of_certification,
                },
                { where: { id: certification_id, user_id: id } },
            );
            if (!updated[0]) {
                throw new ApiError(404, 'This is not your certification profile to edit');
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This certification profile already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/profile/certification/delete
    async deleteUserCertification(id, certification_id) {
        try {
            const deleted = await UserCertification.destroy({
                where: { id: certification_id, user_id: id },
                force: true,
            });

            if (!deleted) {
                throw new ApiError(404, 'This is not your certification profile to delete');
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new ProfileService();
