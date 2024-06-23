import {getUserId} from "../auth/utils.mjs";
import { updateTodo } from '../../dataLayer/todosAccess.mjs';

export async function handler(event) {
  const authorization = event.headers.Authorization
  const userId = getUserId(authorization);
  const { name, todoId, done } = JSON.parse(event.body);

  // fetch the specific todo item using the todoId
  // modify the required properties
  // reuse the unchanged properties

  await updateTodo(todoId, userId, {
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
  };
}
