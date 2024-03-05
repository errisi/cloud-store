"use strict";

// npm run seeder:create -- --name add-users

const initialFolders = require("./20240305151526-add-folders.json");

const TABLE_NAME = "folders";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(TABLE_NAME, initialFolders);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(TABLE_NAME, {
      name: initialFolders.map((folder) => folder.title),
    });
  },
};
