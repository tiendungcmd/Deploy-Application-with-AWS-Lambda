import * as AWS from "@aws-sdk/client-s3";
import { createLogger } from '../auth/logger.mjs';
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
    region: 'us-east-2',
});
const logger = createLogger('attachmentUtils');
const bucketName = process.env.S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;


export function getAttachmentUrl(attachmentId) {
  return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`;
}

export async function getUploadUrl(attachmentId) {
  logger.info(`Attachment ${attachmentId} get`);
  return await getSignedUrl(client, new GetObjectCommand({
    Bucket: bucketName,
    Key: attachmentId
  }));
  logger.info(`Attachment ${attachmentId} get`);
  // return client.getSignedUrl('putObject', {
  //   Bucket: bucketName,
  //   Key: attachmentId,
  //   Expires: parseInt(urlExpiration),
  // });
}

export async function deleteAttachment(attachmentId) {
  try {
    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: attachmentId,
      })
      .promise();
    logger.info(`Attachment ${attachmentId} deleted`);
  } catch (error) {
    logger.error(`Error deleting attachment ${attachmentId}`, { error });
    throw new Error('Error deleting attachment');
  }
}
