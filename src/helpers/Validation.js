const { Joi } = require('express-validation');

const signup = {
    body: Joi.object({
        name: Joi.string().required().pattern(new RegExp('[a-zA-Z]+$')),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).max(20),
        birthday: Joi.date().optional(),
        gender: Joi.valid('none', 'male', 'female', 'other').optional(),
        phone: Joi.string()
            .length(10)
            .pattern(/^[0-9]+$/)
            .optional(),
    }),
};

const signin = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

module.exports = { signup, signin };
