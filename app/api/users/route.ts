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
