const complementService = require('../services/ComplementService');
const { response } = require('../../helpers/Response');

class ComplementController {
    // skills
    // [GET] /api/complement/skills
    async getAllSkills(req, res, next) {
        try {
            const skills = await complementService.getAllSkills();
            res.status(200).json(response(skills));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/complement/skills/:skill_slug
    async getSkillBySlug(req, res, next) {
        try {
            const { skill_slug } = req.params;
            const skill = await complementService.getSkillBySlug(skill_slug);
            res.status(200).json(response(skill));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/complement/skills/create-skill
    async createSkill(req, res, next) {
        try {
            const formData = req.body;
            const newSkill = await complementService.createSkill(formData);
            res.status(201).json(response(newSkill));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/complement/skills/:skill_id
    async editSkill(req, res, next) {
        try {
            const { skill_id } = req.params;
            const formData = req.body;
            const newSkill = await complementService.editSkill(skill_id, formData);
            res.status(201).json(response(newSkill));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/complement/skills/:skill_id
    async deleteSkill(req, res, next) {
        try {
            const { skill_id } = req.params;
            await complementService.deleteSkill(skill_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // languages
    // [GET] /api/complement/languages
    async getAllLanguages(req, res, next) {
        try {
            const languages = await complementService.getAllLanguages();
            res.status(200).json(response(languages));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/complement/languages/:language_slug
    async getLanguageBySlug(req, res, next) {
        try {
            const { language_slug } = req.params;
            const language = await complementService.getLanguageBySlug(language_slug);
            res.status(200).json(response(language));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/complement/languages/create-language
    async createLanguage(req, res, next) {
        try {
            const formData = req.body;
            const newLanguage = await complementService.createLanguage(formData);
            res.status(201).json(response(newLanguage));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/complement/languages/:language_id
    async editLanguage(req, res, next) {
        try {
            const { language_id } = req.params;
            const formData = req.body;
            const newLanguage = await complementService.editLanguage(language_id, formData);
            res.status(201).json(response(newLanguage));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/complement/languages/:language_id
    async deleteLanguage(req, res, next) {
        try {
            const { language_id } = req.params;
            await complementService.deleteLanguage(language_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // universities
    // [GET] /api/complement/universities
    async getAllUniversities(req, res, next) {
        try {
            const universities = await complementService.getAllUniversities();
            res.status(200).json(response(universities));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/complement/universities/:university_slug
    async getUniversityBySlug(req, res, next) {
        try {
            const { university_slug } = req.params;
            const university = await complementService.getUniversityBySlug(university_slug);
            res.status(200).json(response(university));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/complement/universities/create-university
    async createUniversity(req, res, next) {
        try {
            const formData = req.body;
            const newUniversity = await complementService.createUniversity(formData);
            res.status(201).json(response(newUniversity));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/complement/universities/:university_id
    async editUniversity(req, res, next) {
        try {
            const { university_id } = req.params;
            const formData = req.body;
            const newUniversity = await complementService.editUniversity(university_id, formData);
            res.status(201).json(response(newUniversity));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/complement/universities/:university_id
    async deleteUniversity(req, res, next) {
        try {
            const { university_id } = req.params;
            await complementService.deleteUniversity(university_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // countries
    // [GET] /api/complement/countries
    async getAllCountries(req, res, next) {
        try {
            const countries = await complementService.getAllCountries();
            res.status(200).json(response(countries));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/complement/countries/:country_slug
    async getCountryBySlug(req, res, next) {
        try {
            const { country_slug } = req.params;
            const country = await complementService.getCountryBySlug(country_slug);
            res.status(200).json(response(country));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/complement/countries/create-country
    async createCountry(req, res, next) {
        try {
            const formData = req.body;
            const newCountry = await complementService.createCountry(formData);
            res.status(201).json(response(newCountry));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/complement/countries/:country_id
    async editCountry(req, res, next) {
        try {
            const { country_id } = req.params;
            const formData = req.body;
            const newCountry = await complementService.editCountry(country_id, formData);
            res.status(201).json(response(newCountry));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/complement/countries/:country_id
    async deleteCountry(req, res, next) {
        try {
            const { country_id } = req.params;
            await complementService.deleteCountry(country_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // majors
    // [GET] /api/complement/majors
    async getAllMajors(req, res, next) {
        try {
            const majors = await complementService.getAllMajors();
            res.status(200).json(response(majors));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/complement/majors/:major_slug
    async getMajorBySlug(req, res, next) {
        try {
            const { major_slug } = req.params;
            const major = await complementService.getMajorBySlug(major_slug);
            res.status(200).json(response(major));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/complement/majors/create-major
    async createMajor(req, res, next) {
        try {
            const formData = req.body;
            const newMajor = await complementService.createMajor(formData);
            res.status(201).json(response(newMajor));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/complement/majors/:major_id
    async editMajor(req, res, next) {
        try {
            const { major_id } = req.params;
            const formData = req.body;
            const newMajor = await complementService.editMajor(major_id, formData);
            res.status(201).json(response(newMajor));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/complement/majors/:major_id
    async deleteMajor(req, res, next) {
        try {
            const { major_id } = req.params;
            await complementService.deleteMajor(major_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // academic_titles
    // [GET] /api/complement/academic_titles
    async getAllTitles(req, res, next) {
        try {
            const titles = await complementService.getAllTitles();
            res.status(200).json(response(titles));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/complement/academic_titles/:title_slug
    async getTitleBySlug(req, res, next) {
        try {
            const { title_slug } = req.params;
            const title = await complementService.getTitleBySlug(title_slug);
            res.status(200).json(response(title));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/complement/academic_titles/create-title
    async createTitle(req, res, next) {
        try {
            const formData = req.body;
            const newTitle = await complementService.createTitle(formData);
            res.status(201).json(response(newTitle));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/complement/academic_titles/:title_id
    async editTitle(req, res, next) {
        try {
            const { title_id } = req.params;
            const formData = req.body;
            const newTitle = await complementService.editTitle(title_id, formData);
            res.status(201).json(response(newTitle));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/complement/academic_titles/:title_id
    async deleteTitle(req, res, next) {
        try {
            const { title_id } = req.params;
            await complementService.deleteTitle(title_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ComplementController();
