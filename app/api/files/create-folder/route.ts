import { connectToDb } from "@/app/db_connection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sequelize = await connectToDb();
  const { title, path, ownerId } = await req.json();

  const sameFolder = await sequelize.models.Files.findOne({
    where: { title, path, ownerId },
  });

  if (sameFolder) {
    return NextResponse.json(
      { error: "A folder with the same name already exists" },
      { status: 409 }
    );
  }

  const isFolderValid = () => {
    if (
      !title ||
      title.trim().length <= 0 ||
      typeof title !== "string" ||
      !path ||
      path.trim().length <= 0 ||
      typeof path !== "string" ||
      !ownerId ||
      typeof ownerId !== "number"
    ) {
      return false;
    }

    return true;
  };

  if (!isFolderValid()) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 422 }
    );
  }

  const newFolder = await sequelize.models.Files.create({
    type: "folder",
    title,
    path,
    content: "",
    url: null,
    ownerId,
  });

  return NextResponse.json({ newFolder });
}
