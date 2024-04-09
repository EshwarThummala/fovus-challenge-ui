import aws from "aws-sdk";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CognitoIdentityServiceProvider, CognitoIdentity } from "aws-sdk";

const region = "us-east-1";
const bucketName = "eshwar-fovus-challenge-bucket-s3";
aws.config.update({region: region})

export async function uploadFileToS3(file, tokens) {
  const s3 = new S3Client({
    region: region,
    credentials: tokens
  });

  const params = {
    Bucket: bucketName,
    Key: file.name,
    Body: file,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("File uploaded successfully:", data.Location);
  } catch (err) {
    console.error("Error uploading file:", err);
  }

  return bucketName+'/'+file.name
}
