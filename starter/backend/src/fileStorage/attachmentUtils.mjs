const bucketName = process.env.S3_BUCKET

export function getFormattedUrl(todoId) {
  return `https://${bucketName}.s3.amazonaws.com/${todoId}`;
}
