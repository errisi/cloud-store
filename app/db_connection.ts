import { Users } from "@/models/User";
import { Sequelize } from "sequelize-typescript";
import * as pg from "pg";

export const connectToDb = async () => {
  const DB_NAME = process.env.POSTGRES_DATABASE;
  const DB_USER = process.env.POSTGRES_USER;
  const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
  const DB_HOST = process.env.POSTGRES_HOST;
  const DB_PORT = process.env.POSTGRES_PORT;

  if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
    throw new Error("One or more required environment variables are not set.");
  }

  const DB_URI = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  const sequelize = new Sequelize(DB_URI, {
    models: [Users],
    dialect: "postgres",
    dialectOptions: {
      ssl: true,
    },
    dialectModule: pg,
  });

  try {
    await sequelize.authenticate();

    console.log("Successfully connected to DB");
  } catch (e) {
    console.error("Failed to connect to DB", e);

    throw e;
  }

  return sequelize;
};
