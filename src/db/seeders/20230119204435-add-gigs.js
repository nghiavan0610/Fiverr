'use strict';
const crypto = require('crypto');
const Gigs = require('../mockData/gigs_mock_data');
const GigServices = require('../mockData/gig_services_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        let GigServiceID = [];
        GigServices.forEach((el) => {
            GigServiceID.push(el.id);
        });

        const usersID = await queryInterface.sequelize.query(`SELECT id from Users where role = "seller";`);
        const UserID = usersID[0];
        const data = Gigs.map((v) => ({
            ...v,
            id: ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
                (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
            ),
            price_basic: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
            price_standard: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
            price_premium: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
            gig_service_id: GigServiceID[(Math.random() * GigServiceID.length) | 0],
            seller_id: UserID[(Math.random() * UserID.length) | 0].id,
        }));
        await queryInterface.bulkInsert('Gigs', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Gigs', null, {});
    },
};
