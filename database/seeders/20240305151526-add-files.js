"use strict";

// npm run seeder:create -- --name add-users

const initialFiles = require("./20240305151526-add-files.json");

const TABLE_NAME = "files";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_NAME, initialFiles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TABLE_NAME, {
      name: initialFiles.map((file) => file.title),
    });
  },
};
