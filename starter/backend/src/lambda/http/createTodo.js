import { createTodo } from '../../dataLayer/todosAccess.mjs';
import { v4 as uuid } from 'uuid';
import { getUserId } from '../auth/utils.mjs';
export async function handler(event) {
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
  await createTodo(newTodo);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTodo
    })
  };
}

