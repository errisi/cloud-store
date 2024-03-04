const dotenv = require('dotenv');

dotenv.config();

const DB_NAME = process.env.POSTGRES_DATABASE;
const DB_USER = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_HOST = process.env.POSTGRES_HOST;
const DB_PORT = process.env.POSTGRES_PORT;

const DB_URI = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const settings = {
  seederStorage: 'sequelize',
  url: DB_URI,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
};

module.exports = {
  development: { ...settings },
  test: { ...settings },
  production: { ...settings },
};
