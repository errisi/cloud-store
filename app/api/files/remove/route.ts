import { connectToDb } from "@/app/db_connection";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const sequelize = await connectToDb();
  const { filesIds } = await req.json();
  console.log(filesIds);

  await sequelize.models.Files.destroy({ where: { id: filesIds } });

  return NextResponse.json({ message: "success" });
}
