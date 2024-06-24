import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const logger = createLogger('auth')

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    bucketName = process.env.S3_BUCKET,
    todoCreatedIndex = process.env.TODOS_USER_INDEX,
    urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION),
    S3ClientXRay = AWSXRay.captureAWSv3Client(new S3Client())
  ){
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.bucketName = bucketName
    this.urlExpiration = urlExpiration
    this.todoCreatedIndex = todoCreatedIndex
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.s3ClientXRay = S3ClientXRay
  }
  async getAllTodos(userId) {
    const result = await this.dynamoDbClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todoCreatedIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });
  
    return result.Items;
  }

  async createTodo(todo) {
    await this.dynamoDbClient
      .put({
        TableName: this.todosTable,
        Item: todo,
      });
  }

  async deleteTodo(todoId, userId) {
    logger.info(`todoId delete ${todoId} `);
    logger.info(`userId delete ${userId} `);
    await this.dynamoDbClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId,
        },
      });
  }

  async updateTodo(todoId, userId, updatedTodo) {
    logger.info(`todoId updateTodo ${todoId} `);
    logger.info(`userId updateTodo ${userId} `);
    logger.info(`updatedTodo name ${updatedTodo.name} `);
    logger.info(`updatedTodo todoId ${updatedTodo.todoId} `);
    await this.dynamoDbClient
      .update({
        TableName: this.todosTable,
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

  async updateUrl(todoId, userId, image, attachmentUrl) {
    logger.info(`todoId updateTodo ${todoId} `);
    logger.info(`userId updateTodo ${userId} `);
    logger.info(`image:  ${image} `);
    logger.info(`attachmentUrl:  ${attachmentUrl} `);
  
    await this.dynamoDbClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId,
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl,
        }
      });
  }

  async getUploadUrl(imageId) {
    const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: imageId
    })

    logger.info('Signed URL info: ', {
        'command': command,
        'bucket': this.bucketName,
        'imageId': imageId,
        'expiresIn': this.urlExpiration,
    })

    const url = await getSignedUrl(this.s3ClientXRay, command, {
        expiresIn: this.urlExpiration
    })
    return url
}
}

