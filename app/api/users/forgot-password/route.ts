import { connectToDb } from "@/app/db_connection";
import { Users } from "@/app/models/user.model";
import { emailService } from "@/app/services/email.service";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const { email } = await req.json();
  const sequelize = await connectToDb();

  const user = (await sequelize.models.Users.findOne({
    where: { email },
  })) as Users;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const resetToken = uuid();

  user.activationToken = resetToken;
  user.save();

  await emailService.sendResetPasswordEmail(email, resetToken);

  return NextResponse.json({ message: "success", user });
}
