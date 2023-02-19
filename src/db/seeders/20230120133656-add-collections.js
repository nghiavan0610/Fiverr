'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const listsID = await queryInterface.sequelize.query(`SELECT id from Lists;`);
        const ListID = listsID[0];

        const gigsID = await queryInterface.sequelize.query(`SELECT id from Gigs;`);
        const GigID = gigsID[0];

        const sellersID = await queryInterface.sequelize.query(`SELECT id from Users where role = "seller";`);
        const SellerID = sellersID[0];

        let data = [];
        for (let i = 0; i < 100; i++) {
            if (i < 60) {
                data.push({
                    id: i + 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    list_id: ListID[(Math.random() * ListID.length) | 0].id,
                    tag_id: GigID[(Math.random() * GigID.length) | 0].id,
                    tag_type: 'GIG',
                });
            } else {
                data.push({
                    id: i + 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    list_id: ListID[(Math.random() * ListID.length) | 0].id,
                    tag_id: SellerID[(Math.random() * SellerID.length) | 0].id,
                    tag_type: 'SELLER',
                });
            }
        }

        // filter duplicates
        data = data.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) =>
                        (t.list_id === value.list_id && t.tag_id === value.tag_id && t.tag_type === 'GIG') ||
                        (t.list_id === value.list_id && t.tag_id === value.tag_id && t.tag_type === 'SELLER'),
                ),
        );
        await queryInterface.bulkInsert('Collections', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Collections', null, {});
    },
};
