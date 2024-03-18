import { connectToDb } from "@/app/db_connection";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(file: any) {
  const fileName = `${uuid()}-${file.name}`;

  const fileBuffer = await file.arrayBuffer();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: file.type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(req: Request) {
  try {
    const sequelize = await connectToDb();
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    const ownerIdParams = searchParams.get("ownerId");
    const ownerId = Number(ownerIdParams);

    console.log([ownerId, path]);

    const isFileValid = () => {
      if (
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

    if (!isFileValid()) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 422 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as any;

    console.log(file);

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const fileName = await uploadFileToS3(file);

    const newFile = await sequelize.models.Files.create({
      type: file.type,
      title: file.name,
      path,
      content: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      url: null,
      ownerId,
    });

    return NextResponse.json({ newFile });
  } catch (error) {
    return NextResponse.json({ error: `Error uploading file: ${error}` });
  }
}
