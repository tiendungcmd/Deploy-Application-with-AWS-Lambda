import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const ddb = AWSXRay.captureAWSClient(new AWS.DynamoDB());
const XAWS = AWSXRay.captureAWSClient(AWS)
//import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

//const docClient = new DynamoDBClient({region: 'us-east-1'});
//const docClient = new AWS.DynamoDB.DocumentClient()
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const todoCreatedIndex = process.env.TODOS_CREATED_AT_INDEX
console.log("After creating DocumentClient");
export async function getAllTodos(userId) {
  const result = await docClient
    .query({
      TableName: todosTable,
      IndexName: todoCreatedIndex,
      KeyConditionExpression: 'paritionKey = :paritionKey',
      ExpressionAttributeValues: {
        ':paritionKey': userId,
      },
    })
    .promise();

  return result.Items;
}
export async function createTodo(todo) {
  await docClient
    .put({
      TableName: todosTable,
      Item: todo,
    })
    .promise();
}
export async function deleteTodo(todoId, userId) {
  await docClient
    .delete({
      TableName: todosTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    })
    .promise();
}

export async function updateTodo(todoId, userId, updatedTodo) {
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
    })
    .promise();
}



