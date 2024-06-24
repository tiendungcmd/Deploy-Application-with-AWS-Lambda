import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { createLogger } from '../auth/logger.mjs';
const client = new DynamoDBClient({
  region: "us-east-1",
});

const docClient = DynamoDBDocument.from(client);
//--------------
const logger = createLogger('Todo');
const todosTable = process.env.TODOS_TABLE;
const todoCreatedIndex = process.env.TODOS_CREATED_AT_INDEX
const bucketName = process.env.S3_BUCKET;
console.log("After creating DocumentClient");
export async function getAllTodos(userId) {
  const result = await docClient
    .query({
      TableName: todosTable,
      IndexName: todoCreatedIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

  return result.Items;
}
export async function createTodo(todo) {
  await docClient
    .put({
      TableName: todosTable,
      Item: todo,
    });
}
export async function deleteTodo(todoId, userId) {
  logger.info(`todoId delete ${todoId} `);
  logger.info(`userId delete ${userId} `);
  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    });
}

export async function updateTodo(todoId, userId, updatedTodo) {
  logger.info(`todoId updateTodo ${todoId} `);
  logger.info(`userId updateTodo ${userId} `);
  logger.info(`updatedTodo ${updatedTodo} `);
  await docClient
    .update({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done,
      },
      ExpressionAttributeNames: {
        '#name': 'name',
      },
    });
}


export async function updateUrl(todoId, userId, image, imageId) {
  logger.info(`todoId updateTodo ${todoId} `);
  logger.info(`userId updateTodo ${userId} `);

  const url = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  await docClient
    .update({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
      UpdateExpression: "set  image = :image, attachmentUrl = :url",
      ExpressionAttributeValues: {
        ':image': image,
        ":url": url,
      }
    });
}


