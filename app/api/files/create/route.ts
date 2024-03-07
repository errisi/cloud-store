import { connectToDb } from "@/app/db_connection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sequelize = await connectToDb();
  const { title, path, ownerId } = await req.json();

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

  const newFolder = await sequelize.models.Folders.create({
    title,
    path,
    ownerId,
  });

  return NextResponse.json({ newFolder });
}