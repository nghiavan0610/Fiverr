'use strict';
const Skills = require('../mockData/skills_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Skills;
        await queryInterface.bulkInsert('Skills', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Skills', null, {});
    },
};
