const settingService = require('../services/SettingService');
const { response } = require('../../helpers/Response');
const { ApiError } = require('../../helpers/ErrorHandler');
const { deleteToken } = require('../../helpers/Token');

class SettingController {
    // [PUT] /api/setting/account/edit
    async updateUserAccount(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const newSetting = await settingService.updateUserAccount(id, formData);
            res.status(201).json(response(newSetting));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/setting/account/deactivate
    async deactivateUserAccount(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await settingService.deactivateUserAccount(id, formData);
            await deleteToken(req.jti);
            res.cookie('jwt', '', { maxAge: '1' });
            res.status(200).json(response('Account has been deactivated'));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/setting/security/edit
    async updateUserSecurity(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await settingService.updateUserSecurity(id, formData);
            await deleteToken(req.jti);
            res.cookie('jwt', '', { maxAge: '1' });
            res.status(201).json(response('Password updated successfully! Pleaase signin again'));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new SettingController();
