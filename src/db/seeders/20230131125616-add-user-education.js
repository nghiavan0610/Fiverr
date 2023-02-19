'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersArr = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const userID = usersArr[0];

        const universitiesArr = await queryInterface.sequelize.query(`SELECT id from Universities;`);
        const universityID = universitiesArr[0];

        const majorsArr = await queryInterface.sequelize.query(`SELECT id from Majors;`);
        const majorID = majorsArr[0];

        const countriesArr = await queryInterface.sequelize.query(`SELECT id from Countries;`);
        const countryID = countriesArr[0];

        const titlesArr = await queryInterface.sequelize.query(`SELECT id from AcademicTitles;`);
        const titleID = titlesArr[0];

        let data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                id: i + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                user_id: userID[(Math.random() * userID.length) | 0].id,
                university_id: universityID[(Math.random() * universityID.length) | 0].id,
                major_id: majorID[(Math.random() * majorID.length) | 0].id,
                country_id: countryID[(Math.random() * countryID.length) | 0].id,
                title_id: titleID[(Math.random() * titleID.length) | 0].id,
                year_of_graduation: Math.floor(Math.random() * (2023 - 1960 + 1) + 1960),
            });
        }

        // filter duplicates
        data = data.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) =>
                        t.user_id === value.user_id &&
                        t.university_id === value.university_id &&
                        t.major_id === value.major_id &&
                        t.country_id === value.country_id &&
                        t.title_id === value.title_id,
                ),
        );
        await queryInterface.bulkInsert('UserEducations', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('UserEducations', null, {});
    },
};
