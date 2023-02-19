'use strict';
const AcademicTitles = require('../mockData/academic_titles_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = AcademicTitles;
        await queryInterface.bulkInsert('AcademicTitles', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('AcademicTitles', null, {});
    },
};
