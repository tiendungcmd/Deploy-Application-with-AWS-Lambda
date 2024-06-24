import {getUserId} from "../auth/utils.mjs";
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

    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)
    const todo = event.pathParameters.todoId
    const { name, todoId, done } = JSON.parse(event.body);
  
    await todoAccess.updateTodo(todo, userId, {
      name,
      done,
      dueDate: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'TODO updated successfully'
      })
    }
  })