import { connectToDb } from '../db_connection';
import { Tokens } from '../models/token.model';

async function save(userId: number, newToken: string) {
  const sequelize = await connectToDb();
  const token = await sequelize.models.Tokens.findOne({ where: { userId } }) as Tokens;

  if (!token) {
    await Tokens.create({ userId, refreshToken: newToken });

    return;
  }

  token.refreshToken = newToken;

  await token.save();
}

async function getByToken(refreshToken: string) {
  const sequelize = await connectToDb();
  return sequelize.models.Tokens.findOne({ where: { refreshToken } });
}

async function remove(userId: number) {
  const sequelize = await connectToDb();
  return sequelize.models.Tokens.destroy({ where: { userId } });
}

export const tokenService = {
  save,
  getByToken,
  remove,
};
