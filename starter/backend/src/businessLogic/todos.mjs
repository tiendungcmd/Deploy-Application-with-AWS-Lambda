import * as uuid from 'uuid'
import { updateUrl } from "../dataLayer/todosAccess.mjs";
import { createLogger } from "../utils/logger.mjs";

const logger = createLogger('businessLogic')

export async function setAttachmentUrl(userId, todoId, image, attachmentUrl) {
    logger.info(`setAttachmentUrl ${userId} todoId ${todoId} attachmentUrl ${attachmentUrl}`)
    return await updateUrl(userId, todoId, image, attachmentUrl);
}