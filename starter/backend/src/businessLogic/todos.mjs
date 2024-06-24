import { createLogger } from "../utils/logger.mjs";
import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()
const logger = createLogger('businessLogic')

export async function setAttachmentUrl(userId, todoId, image, attachmentUrl) {
    logger.info(`setAttachmentUrl ${userId} todoId ${todoId} attachmentUrl ${attachmentUrl}`)
    return await todoAccess.updateUrl(todoId, userId, image, attachmentUrl);
}