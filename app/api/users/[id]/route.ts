import { connectToDb } from "@/app/db_connection";
import { Users } from "@/app/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { emailService } from "@/app/services/email.service";

export async function PATCH(req: Request, context: any) {
  const { params } = context;
  const { id: idParams } = params;
  const id = Number(idParams);
  const sequelize = await connectToDb();

  const { email, password } = await req.json();

  const user = (await sequelize.models.Users.findByPk(id)) as Users;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (email) {
    const existingUserByEmail = await sequelize.models.Users.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Email already exist" },
        { status: 409 }
      );
    }

    if (email.trim().length <= 0 || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid Email" }, { status: 422 });
    }

    const activationToken = uuid();
    await emailService.sendActivationEmail(email, activationToken);
  }

  let hashedPass;

  if (password) {
    if (password.trim().length <= 0 || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid Password" }, { status: 422 });
    }

    hashedPass = await bcrypt.hash(password, 10);
  }

  const values = {
    password:
      !!password && typeof password === "string" && password.trim().length > 0
        ? hashedPass
        : undefined,
    email,
  };

  const validValues = Object.fromEntries(
    Object.entries(values).filter(([, v]) => v)
  );

  const updatedUser = await sequelize.models.Users.update(
    {
      ...validValues,
    },
    {
      where: { id },
      returning: true,
    }
  );

  return NextResponse.json(updatedUser);
}
