import { connectToDb } from "@/app/db_connection";
import { Files } from "@/app/models/file.model";
import { NextResponse } from "next/server";
import { Op } from 'sequelize';

export async function PATCH(req: Request, { params }: any) {
  const sequelize = await connectToDb();
  const { id: idParams } = params;
  const id = idParams;
  const { path } = await req.json();

  const initialFile = await sequelize.models.Files.findByPk(id) as Files;

  if (!initialFile) {
    return NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
    );
  }

  const moveFile = async (file: Files, newParentPath: string) => {
    const searchPath = file.path !== '/' ? `${file.path}/${file.title}` : '/' + file.title;
    const filesFromPath =
      await sequelize.models.Files.findAll({ where: { path: searchPath, ownerId: file.ownerId } }) as Files[];

    for (const currentFile of filesFromPath) {
      const relativePath = currentFile.path.substring(file.path.length);

      const updatedPath = newParentPath !== '/' ?
        `${newParentPath}${relativePath.startsWith('/') ? '' : '/'}${relativePath}` :
        `${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;

      console.log(`relatile = ${relativePath}, updatedPath = ${updatedPath}`)

      if (currentFile.type === 'folder') {
        await moveFile(currentFile, updatedPath);
      } else {
        currentFile.path = updatedPath;
        await currentFile.save();
      }
    }

    file.path = newParentPath;
    await file.save();
  }

  if (initialFile.type === 'folder') {
    await moveFile(initialFile, path);
  } else {
    initialFile.path = path;
    await initialFile.save();
  }

  return NextResponse.json(initialFile);
}
