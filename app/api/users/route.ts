import { connectToDb } from "@/app/db_connection";
import { NextResponse } from "next/server";
import { Users } from "@/app/models/user.model";
import { jwtService } from "@/app/services/jwt.service";
import { tokenService } from "@/app/services/token.service";

export async function GET(req: Request) {
  const sequelize = await connectToDb();
  const users = await sequelize.models.Users.findAll();

  return NextResponse.json({ users });
}

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

  const cookieHeader = `refreshToken=${refreshToken}; Max-Age=${
    30 * 24 * 60 * 60
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
