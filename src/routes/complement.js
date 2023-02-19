const express = require('express');
const router = express.Router();
const complementController = require('../app/controllers/ComplementController');
const { requireAuth } = require('../middlewares/AuthMiddleware');
const requireRole = require('../middlewares/RoleMiddleware');

// skills
router.get('/skills', requireAuth, complementController.getAllSkills);
router.get('/skills/:skill_slug', requireAuth, complementController.getSkillBySlug);
router.post('/skills/create-skill', requireAuth, requireRole('admin'), complementController.createSkill);
router.put('/skills/:skill_id', requireAuth, requireRole('admin'), complementController.editSkill);
router.delete('/skills/:skill_id', requireAuth, requireRole('admin'), complementController.deleteSkill);

// languages
router.get('/languages', requireAuth, complementController.getAllLanguages);
router.get('/languages/:language_slug', requireAuth, complementController.getLanguageBySlug);
router.post('/languages/create-language', requireAuth, requireRole('admin'), complementController.createLanguage);
router.put('/languages/:language_id', requireAuth, requireRole('admin'), complementController.editLanguage);
router.delete('/languages/:language_id', requireAuth, requireRole('admin'), complementController.deleteLanguage);

// universities
router.get('/universities', requireAuth, complementController.getAllUniversities);
router.get('/universities/:university_slug', requireAuth, complementController.getUniversityBySlug);
router.post(
    '/universities/create-university',
    requireAuth,
    requireRole('admin'),
    complementController.createUniversity,
);
router.put('/universities/:university_id', requireAuth, requireRole('admin'), complementController.editUniversity);
router.delete('/universities/:university_id', requireAuth, requireRole('admin'), complementController.deleteUniversity);

// countries
router.get('/countries', requireAuth, complementController.getAllCountries);
router.get('/countries/:country_slug', requireAuth, complementController.getCountryBySlug);
router.post('/countries/create-country', requireAuth, requireRole('admin'), complementController.createCountry);
router.put('/countries/:country_id', requireAuth, requireRole('admin'), complementController.editCountry);
router.delete('/countries/:country_id', requireAuth, requireRole('admin'), complementController.deleteCountry);

// majors
router.get('/majors', requireAuth, complementController.getAllMajors);
router.get('/majors/:major_slug', requireAuth, complementController.getMajorBySlug);
router.post('/majors/create-major', requireAuth, requireRole('admin'), complementController.createMajor);
router.put('/majors/:major_id', requireAuth, requireRole('admin'), complementController.editMajor);
router.delete('/majors/:major_id', requireAuth, requireRole('admin'), complementController.deleteMajor);

// academic titles
router.get('/academic_titles', requireAuth, complementController.getAllTitles);
router.get('/academic_titles/:title_slug', requireAuth, complementController.getTitleBySlug);
router.post('/academic_titles/create-title', requireAuth, requireRole('admin'), complementController.createTitle);
router.put('/academic_titles/:title_id', requireAuth, requireRole('admin'), complementController.editTitle);
router.delete('/academic_titles/:title_id', requireAuth, requireRole('admin'), complementController.deleteTitle);

module.exports = router;
