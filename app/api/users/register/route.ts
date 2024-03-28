import { connectToDb } from "@/app/db_connection";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { emailService } from "@/app/services/email.service";

export async function POST(req: Request) {
  const sequelize = await connectToDb();
  const { email, password } = await req.json();

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

  const user = await sequelize.models.Users.findOne({ where: { email } })

  if (user) {
    return NextResponse.json(
      { error: "User with this email already exists" },
      { status: 409 }
    );
  }

  const activationToken = uuid();
  const hashedPass = await bcrypt.hash(password, 10);

  const newUsers = await sequelize.models.Users.create({
    email,
    password: hashedPass,
    activationToken,
  });

  await emailService.sendActivationEmail(email, activationToken);

  return NextResponse.json({ newUsers });
}