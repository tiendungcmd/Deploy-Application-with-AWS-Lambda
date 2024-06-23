import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs';
export function handler(event) {
  const attachmentId = event.pathParameters.attachmentId;

  try {
    const uploadUrl = getUploadUrl(attachmentId);
    console.log(`Generated upload URL ${attachmentId}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
      }),
    };
  } catch (error) {
    console.error(`Error ${attachmentId}`, error);
    
    return {
      statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
      body: JSON.stringify({
        error: 'Failed upload URL',
      }),
    };
  }
}

