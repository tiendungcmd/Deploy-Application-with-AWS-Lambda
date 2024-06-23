import { getUserId } from "../auth/utils.mjs";
import { deleteTodo } from '../../dataLayer/todosAccess.mjs';

export async function handler(event) {
  const { todoIds } = JSON.parse(event.body);
  const authorization = event.headers.Authorization
  const userId = getUserId(authorization);

  await Promise.all(todoIds.map(todoId => deleteTodo(todoId, userId)));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: 'Deleted successfully'
    })
  };
}

