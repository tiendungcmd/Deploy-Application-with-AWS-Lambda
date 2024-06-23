import * as AWS from 'aws-sdk';
import { createLogger } from '../auth/logger';

const logger = createLogger('attachmentUtils');
const bucketName = process.env.S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new AWS.S3();

export function getAttachmentUrl(attachmentId) {
  return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`;
}

export function getUploadUrl(attachmentId) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: parseInt(urlExpiration),
  });
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
