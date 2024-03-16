import { connectToDb } from "@/app/db_connection";
import { Files } from "@/app/models/file.model";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: any) {
  const sequelize = await connectToDb();
  const { params } = context;
  const { userId: idParams } = params;
  const id = Number(idParams);
  const { path } = await req.json();

  console.log([path, id]);

  const folders = (await sequelize.models.Files.findAll({
    where: { path, ownerId: id },
  })) as Files[];

  if (!folders.length) {
    return NextResponse.json({ folders: [] });
  }

  return NextResponse.json({ folders });
}
