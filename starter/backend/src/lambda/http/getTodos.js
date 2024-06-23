import { getAllTodos } from '../../dataLayer/todosAccess.mjs';
import { getUserId } from "../auth/utils.mjs";
export async function handler(event) {
  console.log('Processing event: ', event)

  const authorization = event.headers.Authorization
  const userId = getUserId(authorization);

  const items = await getAllTodos(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
