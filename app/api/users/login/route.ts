import { connectToDb } from "@/app/db_connection";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Users } from "@/app/models/user.model";
import { generateTokens } from "../route";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const sequelize = await connectToDb();

  const user = (await sequelize.models.Users.findOne({
    where: { email },
  })) as Users;

  console.log(user);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Wrong password" }, { status: 400 });
  }

  const response = await generateTokens(user);

  if (!response) {
    const errorResponse = new NextResponse(
      JSON.stringify({ error: "Failed to generate tokens" }),
      { status: 500 }
    );
    return errorResponse;
  }

  return response;
}
