import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

interface UploadedFile{
  originalname: string;
  buffer: Buffer | Uint8Array | Blob | Readable | string;
}

export const s3Upload = async (file: UploadedFile, uuid: string) => {
  const s3 = new S3Client();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `file/${uuid}-${file.originalname}`,
    Body: file.buffer,
  };

  return await s3.send(new PutObjectCommand(params));
};
