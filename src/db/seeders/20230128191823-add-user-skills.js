'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersID = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const UserID = usersID[0];

        const skillsID = await queryInterface.sequelize.query(`SELECT id from Skills;`);
        const SkillID = skillsID[0];

        const leverArr = ['beginner', 'intermediate', 'expert'];

        let data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                id: i + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                user_id: UserID[(Math.random() * UserID.length) | 0].id,
                skill_id: SkillID[(Math.random() * SkillID.length) | 0].id,
                level: leverArr[(Math.random() * leverArr.length) | 0],
            });
        }

        // filter duplicates
        data = data.filter(
            (value, index, self) =>
                index === self.findIndex((t) => t.user_id === value.user_id && t.skill_id === value.skill_id),
        );
        await queryInterface.bulkInsert('UserSkills', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('UserSkills', null, {});
    },
};
