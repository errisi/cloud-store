import { connectToDb } from "@/app/db_connection";
import { Folders } from "@/app/models/folder.model";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: any) {
  const sequelize = await connectToDb();
  const { params } = context;
  const { userId: idParams } = params;
  const id = Number(idParams);
  const { path } = await req.json();

  console.log([path, id])

  const folders = (await sequelize.models.Folders.findAll({ where: { path, ownerId: id } })) as Folders[];

  if (!folders.length) {
    return  NextResponse.json({ folders: [] });
  }

  return NextResponse.json({ folders });
}