import { updateUrl } from '../../dataLayer/todosAccess.mjs';
import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs';
import { getUserId } from '../auth/utils.mjs';
import { v4 as uuidv4 } from 'uuid';
export function handler(event) {
  console.log(`Processing event ${event}`);
  const attachmentId = event.pathParameters.todoId
  try {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event.headers.Authorization);
    const imageId = uuidv4()
    console.log(`Processing event 2 ${event}`);
    const uploadUrl = updateUrl(todoId,userId,imageId);
    getUploadUrl(imageId);
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