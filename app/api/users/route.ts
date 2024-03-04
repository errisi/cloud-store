import { connectToDb } from "@/app/db_connection";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const sequelize = await connectToDb();
  const users = await sequelize.models.Users.findAll();

  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const sequelize = await connectToDb();
  const { email, password, wallpaper } = await req.json();

  const isUserValid = () => {
    if (
      !email ||
      email.trim().length <= 0 ||
      typeof email !== "string" ||
      !password ||
      password.trim().length <= 0 ||
      typeof password !== "string"
    ) {
      return false;
    }

    return true;
  };

  if (!isUserValid()) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 422 }
    );
  }

  const newUsers = await sequelize.models.Users.create({
    email,
    password,
    wallpaper: wallpaper ? wallpaper : null,
  });

  return NextResponse.json({ newUsers });
}
