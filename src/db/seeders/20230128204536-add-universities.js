'use strict';
const Universities = require('../mockData/universities_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Universities;
        await queryInterface.bulkInsert('Universities', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Universities', null, {});
    },
};
