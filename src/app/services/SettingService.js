const { ApiError } = require('../../helpers/ErrorHandler');
const { User, Country } = require('../../db/models');

class SettingService {
    // [PUT] /api/setting/account/edit
    async updateUserAccount(id, formData) {
        try {
            const { country } = formData;
            const countryChecked = await Country.findOne({ attributes: ['id'], where: { name: country } });
            if (!countryChecked) {
                throw new ApiError(404, 'Country not found');
            }
            formData.country_id = countryChecked.id;
            const newSetting = await User.update(formData, { where: { id } });
            return newSetting[1][0];
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/setting/account/deactivate
    async deactivateUserAccount(id, formData) {
        try {
            const { confirmPassword } = formData;
            const user = await User.findOne({
                attributes: ['id', 'password', 'slug'],
                where: { id },
            });

            if (user && user.matchPassword(confirmPassword)) {
                await user.destroy({});
            } else {
                throw new ApiError(403, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/setting/security/edit
    async updateUserSecurity(id, formData) {
        try {
            const { oldPassword, newPassword, confirmPassword } = formData;
            const user = await User.findOne({
                attributes: ['id', 'password'],
                where: { id },
            });

            if (user && user.matchPassword(oldPassword)) {
                if (newPassword === confirmPassword) {
                    await user.update({ password: confirmPassword });
                    delete user.dataValues.password;
                } else {
                    throw new ApiError(403, 'Confirm password do not match');
                }
            } else {
                throw new ApiError(403, 'Password do not match');
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new SettingService();
