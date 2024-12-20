import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config.js";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 파일 업로드 함수
const uploadToS3 = async (file) => {
  const uniqueName = `${uuidv4()}-${file.originalname}`; // UUID로 고유 파일 이름 생성
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `profile-icons/${uniqueName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    const location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return location;
  } catch (error) {
    throw new Error("S3 upload failed");
  }
};

export default uploadToS3;
