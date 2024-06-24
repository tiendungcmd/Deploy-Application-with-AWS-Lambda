import { getUserId } from "../auth/utils.mjs";
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { TodoAccess } from '../../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()
export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)
    const userId = getUserId(event.headers.Authorization)
    const newItem = await todoAccess.deleteTodo(event.pathParameters.todoId, userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Deleted successfully'
      })
    }
  })
