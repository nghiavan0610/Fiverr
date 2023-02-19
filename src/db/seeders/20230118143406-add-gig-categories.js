'use strict';
const GigCategories = require('../mockData/gig_categories_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = GigCategories;
        await queryInterface.bulkInsert('GigCategories', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('GigCategories', null, {});
    },
};
