import { NextResponse } from "next/server";
import { connectToDb } from "../db_connection";
import { jwtService } from "../services/jwt.service";
import { tokenService } from "../services/token.service";
import { Users } from "../models/user.model";

export const generateTokens = async (user: Users) => {
  const sequelize = await connectToDb();
  const userFromDb =
    ((await sequelize.models.Users.findByPk(user.id)) as Users) || user;

  const normalizedUser = {
    id: userFromDb.id,
    email: userFromDb.email,
    password: userFromDb.password,
    wallpaper: userFromDb.wallpaper,
    activationToken: userFromDb.activationToken,
  };

  const accessToken = jwtService.sign(normalizedUser);
  const refreshToken = jwtService.signRefresh(normalizedUser);

  if (typeof normalizedUser.id !== "number") {
    return NextResponse.json({ error: "id is NaN" }, { status: 400 });
  }

  await tokenService.save(normalizedUser.id!, refreshToken);

  const cookieHeader = `refreshToken=${refreshToken}; Max-Age=${30 * 24 * 60 * 60
    }; HttpOnly; SameSite=None; Secure`;

  const response = new NextResponse(
    JSON.stringify(
      {
        user: normalizedUser,
        accessToken,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        "Set-Cookie": cookieHeader,
      },
    }
  );

  return response;
};
