import { connectToDb } from "@/app/db_connection";
import { Users } from "@/app/models/user.model";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  const { params } = context;
  const { activationToken } = params;

  const sequelize = await connectToDb();
  const user = (await sequelize.models.Users.findOne({
    where: { activationToken },
  })) as Users;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.activationToken = null;
  user.save();

  return NextResponse.json(user);
}
