import { v4 as uuid } from 'uuid';
import { getUserId } from '../auth/utils.mjs';
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
    console.log('Processing create event: ', event)
    const { name, dueDate } = JSON.parse(event.body);
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization);
    const todoId = uuid();

    const newTodo = {
      todoId,
      userId,
      name,
      dueDate,
      createdAt: new Date().toISOString(),
      done: false
    };
    await todoAccess.createTodo(newTodo);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newTodo
      })
    }
  })
