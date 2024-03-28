import { connectToDb } from "@/app/db_connection";
import { Files } from "@/app/models/file.model";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function GET(req: Request, { params }: any) {
  const sequelize = await connectToDb();
  const { id: urlParams } = params;
  const url = urlParams.toString();

  const file = await sequelize.models.Files.findOne({ where: { url } }) as Files;

  if (!file) {
    return NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
    );
  }

  if (file.type === 'folder') {
    const path = file.path !== '/' ? `${file.path}/${file.title}` : '/' + file.title;

    console.log(`PATH: ${path}`);

    const folders = (await sequelize.models.Files.findAll({
      where: { path, ownerId: file.ownerId },
    })) as Files[];

    if (!folders.length) {
      return NextResponse.json({ folders: [] });
    }

    return NextResponse.json({ folders });
  } else {
    return NextResponse.json({ folders: [ file ] });
  }
}

export async function PATCH(req: Request, { params }: any) {
  const sequelize = await connectToDb();
  const { id: idParams } = params;
  const id = idParams;

  const file = await sequelize.models.Files.findByPk(id) as Files;

  if (!file) {
    return NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
    );
  }

  const url = uuid();

  if (file.url) {
    file.url = null;
  } else {
    file.url = url;
  }

  file.save();

  console.log(file);

  return NextResponse.json(`${process.env.NEXT_PUBLIC_CLIENT_URL}/public/${file.url}`);
}
