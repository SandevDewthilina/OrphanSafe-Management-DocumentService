import {
  S3_REIGON,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET,
} from "../../config/index.js";
import { v4 as uuid4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * create a s3 client with credentials
 */
const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  region: S3_REIGON,
});

/**
 * upload a single file
 * generate a new uuid for name
 */
export const uploadSingleFileAsync = async (path, file) => {
  if (!path.toString().endsWith("/")) {
    path += "/";
  }
  const key = `${path}${uuid4()}--${file.originalname}`;
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  await s3.send(command);
  return key;
};

/**
 * generate signed urls for given keys that expires in time
 */
export const getSignedUrlForKeysAsync = async (keyList) => {
  const urlList = [];
  for (const i in keyList) {
    const key = keyList[i];
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    urlList.push({
      key: key,
      url: await getSignedUrl(s3, command, { expiresIn: 60 }),
    });
  }
  return urlList;
};

/**
 * delete object in s3 for given keys
 */
export const deleteFilesForKeysAsync = async (keyList) => {
  keyList.map(async (key) => {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    await s3.send(command);
  });
};
