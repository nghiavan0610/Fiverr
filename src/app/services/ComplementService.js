const { ApiError } = require('../../helpers/ErrorHandler');
const { Skill, Language, University, Country, Major, AcademicTitle } = require('../../db/models');

class ComplementService {
    // skills
    // [GET] /api/complement/skills
    async getAllSkills() {
        try {
            const skills = await Skill.findAll();
            return skills;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/complement/skills/:skill_slug
    async getSkillBySlug(skill_slug) {
        try {
            const skill = await Skill.findOne({ where: { slug: skill_slug } });
            if (!skill) throw new ApiError(404, `Skill with slug='${skill_slug}' was not found`);

            return skill;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/complement/skills/create-skill
    async createSkill(formData) {
        try {
            const { skill_name } = formData;
            const newSkill = await Skill.findOrCreate({
                where: { name: skill_name },
                defaults: {},
            });
            return newSkill[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/complement/skills/:skill_id
    async editSkill(skill_id, formData) {
        try {
            const { skill_name } = formData;
            const newSkill = await Skill.update({ name: skill_name }, { where: { id: skill_id } });
            if (!newSkill[0] && !newSkill[1][0]) {
                throw new ApiError(404, `Skill with id='${skill_id}' was not found`);
            }
            return newSkill[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This skill already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/complement/skills/:skill_id
    async deleteSkill(skill_id) {
        try {
            const deleted = await Skill.destroy({
                where: { id: skill_id },
                force: true,
            });
            if (!deleted) {
                throw new ApiError(404, `Skill with id='${skill_id}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // languages
    // [GET] /api/complement/languages
    async getAllLanguages() {
        try {
            const languages = await Language.findAll();
            return languages;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/complement/languages/:language_slug
    async getLanguageBySlug(language_slug) {
        try {
            const language = await Language.findOne({ where: { slug: language_slug } });
            if (!language) {
                throw new ApiError(404, `Language with slug='${language_slug}' was not found`);
            }
            return language;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/complement/languages/create-language
    async createLanguage(formData) {
        try {
            const { language_name } = formData;
            const newLanguage = await Language.findOrCreate({
                where: { name: language_name },
                defaults: {},
            });
            return newLanguage[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/complement/languages/:language_id
    async editLanguage(language_id, formData) {
        try {
            const { language_name } = formData;
            const newLanguage = await Language.update(
                { name: language_name },
                {
                    where: { id: language_id },
                },
            );
            if (!newLanguage[0] && !newLanguage[1][0]) {
                throw new ApiError(404, `Language with id='${language_id}' was not found`);
            }
            return newLanguage[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This language already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/complement/languages/:language_id
    async deleteLanguage(language_id) {
        try {
            const deleted = await Language.destroy({
                where: { id: language_id },
                force: true,
            });
            if (!deleted) {
                throw new ApiError(404, `Language with id='${language_id}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // unviersities
    // [GET] /api/complement/universities
    async getAllUniversities() {
        try {
            const universities = await University.findAll();
            return universities;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/complement/universities/:university_slug
    async getUniversityBySlug(university_slug) {
        try {
            const university = await University.findOne({ where: { slug: university_slug } });
            if (!university) {
                throw new ApiError(404, `University with slug='${university_slug}' was not found`);
            }
            return university;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/complement/universities/create-university
    async createUniversity(formData) {
        try {
            const { university_name } = formData;
            const newUniversity = await University.findOrCreate({
                where: { name: university_name },
                defaults: {},
            });
            return newUniversity[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/complement/universities/:university_id
    async editUniversity(university_id, formData) {
        try {
            const { university_name } = formData;
            const newUniversity = await University.update(
                { name: university_name },
                {
                    where: { id: university_id },
                },
            );
            if (!newUniversity[0] && !newUniversity[1][0]) {
                throw new ApiError(404, `University with id='${university_id}' was not found`);
            }
            return newUniversity[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This university already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/complement/universities/:university_id
    async deleteUniversity(university_id) {
        try {
            const deleted = await University.destroy({
                where: { id: university_id },
                force: true,
            });
            if (!deleted) {
                throw new ApiError(404, `University with id='${university_id}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // countries
    // [GET] /api/complement/countries
    async getAllCountries() {
        try {
            const countries = await Country.findAll();
            return countries;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/complement/countries/:country_slug
    async getCountryBySlug(country_slug) {
        try {
            const country = await Country.findOne({ where: { slug: country_slug } });
            if (!country) {
                throw new ApiError(404, `Country with slug='${country_slug}' was not found`);
            }
            return country;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/complement/countries/create-country
    async createCountry(formData) {
        try {
            const { country_name } = formData;
            const newCountry = await Country.findOrCreate({
                where: { name: country_name },
                defaults: {},
            });
            return newCountry[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/complement/countries/:country_id
    async editCountry(country_id, formData) {
        try {
            const { country_name } = formData;
            const newCountry = await Country.update(
                { name: country_name },
                {
                    where: { id: country_id },
                },
            );
            if (!newCountry[0] && !newCountry[1][0]) {
                throw new ApiError(404, `Country with id='${country_id}' was not found`);
            }
            return newCountry[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This country already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/complement/countries/:country_id
    async deleteCountry(country_id) {
        try {
            const deleted = await Country.destroy({
                where: { id: country_id },
                force: true,
            });
            if (!deleted) {
                throw new ApiError(404, `Country with id='${country_id}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // majors
    // [GET] /api/complement/majors
    async getAllMajors() {
        try {
            const majors = await Major.findAll();
            return majors;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/complement/majors/:major_slug
    async getMajorBySlug(major_slug) {
        try {
            const major = await Major.findOne({ where: { slug: major_slug } });
            if (!major) {
                throw new ApiError(404, `Major with slug='${major_slug}' was not found`);
            }
            return major;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/complement/majors/create-major
    async createMajor(formData) {
        try {
            const { major_name } = formData;
            const newMajor = await Major.findOrCreate({
                where: { name: major_name },
                defaults: {},
            });
            return newMajor[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/complement/majors/:major_id
    async editMajor(major_id, formData) {
        try {
            const { major_name } = formData;
            const newMajor = await Major.update(
                { name: major_name },
                {
                    where: { id: major_id },
                },
            );
            if (!newMajor[0] && !newMajor[1][0]) {
                throw new ApiError(404, `Major with id='${major_id}' was not found`);
            }
            return newMajor[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This major already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/complement/majors/:major_id
    async deleteMajor(major_id) {
        try {
            const deleted = await Major.destroy({
                where: { id: major_id },
                force: true,
            });
            if (!deleted) {
                throw new ApiError(404, `Major with id='${major_id}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // academic_titles
    // [GET] /api/complement/academic_titles
    async getAllTitles() {
        try {
            const titles = await AcademicTitle.findAll();
            return titles;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/complement/academic_titles/:title_slug
    async getTitleBySlug(title_slug) {
        try {
            const title = await AcademicTitle.findOne({ where: { slug: title_slug } });
            if (!title) {
                throw new ApiError(404, `Academic title with slug='${title_slug}' was not found`);
            }
            return title;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/complement/academic_titles/create-title
    async createTitle(formData) {
        try {
            const { title_name } = formData;
            const newTitle = await AcademicTitle.findOrCreate({
                where: { name: title_name },
                defaults: {},
            });
            return newTitle[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/complement/academic_titles/:title_id
    async editTitle(title_id, formData) {
        try {
            const { title_name } = formData;
            const newTitle = await AcademicTitle.update(
                { name: title_name },
                {
                    where: { id: title_id },
                },
            );
            if (!newTitle[0] && !newTitle[1][0]) {
                throw new ApiError(404, `Academic title with id='${title_id}' was not found`);
            }
            return newTitle[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This title already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/complement/academic_titles/:title_id
    async deleteTitle(title_id) {
        try {
            const deleted = await AcademicTitle.destroy({
                where: { id: title_id },
                force: true,
            });
            if (!deleted) {
                throw new ApiError(404, `Academic title with id='${title_id}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new ComplementService();
