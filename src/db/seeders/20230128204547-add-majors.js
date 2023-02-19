'use strict';
const Majors = require('../mockData/majors_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Majors;
        await queryInterface.bulkInsert('Majors', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Majors', null, {});
    },
};
