import { connectToDb } from "@/app/db_connection";
import { Files } from "@/app/models/file.model";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const sequelize = await connectToDb();
  const { filesIds } = await req.json();

  const files = await sequelize.models.Files.findAll({ where: { id: filesIds } }) as Files[];

  const getFilesIdsToRemove = async (files: Files[]) => {
    const filesIdsToRemove: number[] = [...filesIds];

    const processFiles = async (files: Files[]) => {
      for (const currentFile of files) {
        const path = currentFile.path !== '/' ? `${currentFile.path}/${currentFile.title}` : `${currentFile.title}`
        const ownerId = currentFile.ownerId;

        const filesFromPath = await sequelize.models.Files.findAll({ where: { path, ownerId } }) as Files[];

        for (const file of filesFromPath) {
          if (file.type === 'folder') {
            await processFiles([file]);
            filesIdsToRemove.push(file.id);
          } else {
            filesIdsToRemove.push(file.id);
          }
        }
      }
    };

    await processFiles(files);
    return filesIdsToRemove;
  };

  const filesIdsToRemove = await getFilesIdsToRemove(files);
  console.log(filesIdsToRemove);

  await sequelize.models.Files.destroy({ where: { id: filesIdsToRemove } });

  return NextResponse.json({ message: "success" });
}
