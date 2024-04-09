import aws from "aws-sdk";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const region = "us-east-1";
const bucketName = "eshwar-fovus-challenge-bucket-s3";
aws.config.update({ region: region });

export async function uploadFileToS3(file, tokens) {
  const s3 = new S3Client({
    region: region,
    credentials: tokens,
  });
  const params = {
    Bucket: bucketName,
    Key: file.name,
    Body: file,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("File uploaded successfully:");
  } catch (err) {
    console.error("Error uploading file:", err);
  }

  return bucketName + "/" + file.name;
}

export async function checkFilePresentInS3(fileName, tokens) {
  const s3 = new S3Client({
    region: region,
    credentials: tokens,
  });

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const command = new HeadObjectCommand(params);
    await s3.send(command);
    return true;
  } catch (err) {
    if (err.name === "NotFound") {
      return false;
    }
  }
}

export async function getFileFromS3(fileName, tokens) {
  const s3 = new S3Client({
    region: region,
    credentials: tokens,
  });

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3.send(command);
    console.log("File accessed successfully successfully:", data);
    return await data.Body.transformToString();
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}
