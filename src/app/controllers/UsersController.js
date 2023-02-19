const usersService = require('../services/UsersService');
const cloudinary = require('cloudinary').v2;
const { response } = require('../../helpers/Response');
const { ApiError } = require('../../helpers/ErrorHandler');

class UsersController {
    // [GET] /api/users
    async getAllUsers(req, res, next) {
        try {
            const queryData = req.query;
            const users = await usersService.getAllUsers(queryData);
            res.status(200).json(response(users));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/users/:user_slug
    async getUserBySlug(req, res, next) {
        try {
            const { user_slug } = req.params;
            const user = await usersService.getUserBySlug(user_slug);
            res.status(200).json(response(user));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/users/start-selling
    async startSelling(req, res, next) {
        try {
            const { id } = req.user;
            const { avatarUrl, avatar, ...formData } = req.body;
            if (!req.file && (!avatarUrl || avatarUrl === 'null')) {
                throw new ApiError(404, 'Please upload your avatar');
            }
            for (let i in formData) {
                if (!formData[i] || formData[i] === 'null') {
                    throw new ApiError(404, 'Please fill in the mandatory fields');
                }
            }

            if (req.file) {
                formData.avatarUrl = req.file.path;
            } else {
                formData.avatarUrl = avatarUrl;
            }

            const userOnboarding = await usersService.startSelling(id, formData);
            res.status(201).json(response(userOnboarding));
        } catch (err) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename);
            }
            next(err);
        }
    }

    // [POST] /api/users/create-user
    async createUser(req, res, next) {
        try {
            const formData = req.body;
            const newUser = await usersService.createUser(formData);
            res.status(201).json(response(newUser));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/users/:user_slug/edit-user-account
    async updateUserAccount(req, res, next) {
        try {
            const formData = req.body;
            const { user_slug } = req.params;
            const newUser = await usersService.updateUserAccount(user_slug, formData);
            res.status(201).json(response(newUser));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/users/:user_slug/edit-user-security
    async updateUserSecurity(req, res, next) {
        try {
            const formData = req.body;
            const { user_slug } = req.params;
            await usersService.updateUserSecurity(user_slug, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/users/:user_slug/ban-user
    async banUser(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { user_slug } = req.params;
            await usersService.banUser(id, user_slug, formData);
            res.status(200).json(response('User has been banned'));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/users/get-deleted-users
    async getDeletedUser(req, res, next) {
        try {
            const deletedUsers = await usersService.getDeletedUser();
            res.status(200).json(response(deletedUsers));
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] /api/users/deleted_users/:user_slug/restore
    async restoreUser(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { user_slug } = req.params;
            await usersService.restoreUser(id, user_slug, formData);
            res.status(200).json(response('User has been restored successfully'));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/users/deleted_users/:user_slug/force-delete
    async forceDeleteUser(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { user_slug } = req.params;
            await usersService.forceDeleteUser(id, user_slug, formData);
            res.status(200).json(response('Account has been removed'));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UsersController();
