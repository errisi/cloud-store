"use strict";

// npm run seeder:create -- --name add-users

const initialUsers = require("./20240304175832-add-users.json");

const TABLE_NAME = "users";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_NAME, initialUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TABLE_NAME, {
      name: initialUsers.map((user) => user.name),
    });
  },
};
