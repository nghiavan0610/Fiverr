'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersID = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const UserID = usersID[0];

        const gigsID = await queryInterface.sequelize.query(`SELECT id from Gigs;`);
        const GigID = gigsID[0];

        const packageArr = ['basic', 'standard', 'premium'];

        let data = [];
        for (let i = 0; i < 500; i++) {
            data.push({
                id: i + 1,
                package: packageArr[(Math.random() * packageArr.length) | 0],
                is_done: Math.random() < 0.5,
                order_date: new Date(),
                updatedAt: new Date(),
                user_id: UserID[(Math.random() * UserID.length) | 0].id,
                gig_id: GigID[(Math.random() * GigID.length) | 0].id,
            });
        }
        await queryInterface.bulkInsert('Orders', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Orders', null, {});
    },
};
