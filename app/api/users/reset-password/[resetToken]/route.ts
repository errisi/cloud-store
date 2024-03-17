import { connectToDb } from "@/app/db_connection";
import { Users } from "@/app/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request, context: any) {
  const sequelize = await connectToDb();
  const { password } = await req.json();
  const { params } = context;
  const { resetToken } = params;

  const user = (await sequelize.models.Users.findOne({
    where: { activationToken: resetToken },
  })) as Users;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  user.activationToken = null;
  user.password = hashedPass;
  user.save();

  return NextResponse.json({ user });
}
