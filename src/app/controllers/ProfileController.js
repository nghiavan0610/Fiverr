const profileService = require('../services/ProfileService');
const cloudinary = require('cloudinary').v2;
const { response } = require('../../helpers/Response');
const { ApiError } = require('../../helpers/ErrorHandler');

class ProfileController {
    // [PUT] /api/profile/upload-avatar
    async uploadAvatar(req, res, next) {
        try {
            const { id } = req.user;
            if (!req.file) {
                throw new ApiError(404, 'Please upload a file');
            }

            const avatarUrl = req.file.path;
            const newAvatar = await profileService.uploadAvatar(id, avatarUrl);
            res.status(201).json(response(newAvatar));
        } catch (err) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename);
            }
            next(err);
        }
    }

    // [PUT] /api/profile/overview
    async updateUserDescription(req, res, next) {
        try {
            const { id } = req.user;
            const { about } = req.body;
            const newDescription = await profileService.updateUserDescription(id, about);
            res.status(201).json(response(newDescription));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/profile/languages/create
    async createUserLanguage(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.createUserLanguage(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/profile/languages/edit
    async updateUserLanguage(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateUserLanguage(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/profile/languages/delete
    async deleteUserLanguage(req, res, next) {
        try {
            const { id } = req.user;
            const { user_language_id } = req.body;
            await profileService.deleteUserLanguage(id, user_language_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/profile/skills/create
    async createUserSkill(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.createUserSkill(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/profile/skills/edit
    async updateUserSkill(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateUserSkill(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/profile/skills/delete
    async deleteUserSkill(req, res, next) {
        try {
            const { id } = req.user;
            const { user_skill_id } = req.body;
            await profileService.deleteUserSkill(id, user_skill_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/profile/education/create
    async createUserEducation(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.createUserEducation(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/profile/education/edit
    async updateUserEducation(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateUserEducation(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/profile/education/delete
    async deleteUserEducation(req, res, next) {
        try {
            const { id } = req.user;
            const { education_id } = req.body;
            await profileService.deleteUserEducation(id, education_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/profile/certification/create
    async createUserCertification(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.createUserCertification(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/profile/certification/edit
    async updateUserCertification(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateUserCertification(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/profile/certification/delete
    async deleteUserCertification(req, res, next) {
        try {
            const { id } = req.user;
            const { certification_id } = req.params;
            await profileService.deleteUserCertification(id, certification_id);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ProfileController();
