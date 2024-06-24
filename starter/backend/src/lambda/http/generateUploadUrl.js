import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../auth/utils.mjs';
import { createLogger } from '../../utils/logger.mjs';
import {getFormattedUrl} from "../../fileStorage/attachmentUtils.mjs";
import {setAttachmentUrl} from '../../businessLogic/todos.mjs'
import { TodoAccess } from '../../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()
const logger = createLogger('Todos logger generateUploadUrl');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId;
    logger.info(`Uploading attachment for ${todoId}`)

    const image = JSON.parse(event.body)
    const userId = getUserId(event.headers.Authorization);

    const attachmentUrl = getFormattedUrl(todoId)
    const uploadUrl = await todoAccess.getUploadUrl(todoId)

    await setAttachmentUrl(userId, todoId, image, attachmentUrl)

    return {
      statusCode: 201, body: JSON.stringify({
        uploadUrl
      })
    }
  })