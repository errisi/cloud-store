import { connectToDb } from "@/app/db_connection";
import { Files } from "@/app/models/file.model";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: any) {
  const sequelize = await connectToDb();
  const { id: idParams } = params;
  const id = idParams;
  const { path } = await req.json();

  const file = await sequelize.models.Files.findByPk(id) as Files;

  if (!file) {
    return NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
    );
  }

  file.path = path;
  file.save();

  console.log(file);

  return NextResponse.json(file);
}
