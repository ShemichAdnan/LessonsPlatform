import * as messageModel from '../models/messageModel.js';
import * as conversationModel from '../models/conversationModel.js';

export async function sendMessage(data: {
    conversationId?: string;
    recipientId?: string;
    senderId: string;
    content: string;
}){
    let conversationId = data.conversationId;;
    if(!conversationId && data.recipientId){
        const conversation= await conversationModel.findOrCreateConversation(data.senderId,data.recipientId);
        conversationId= conversation.id;
    }
    if(!conversationId){
        throw new Error('Either conversationId or recipientId must be provided');
    }

    if(data.content.trim() === ''){
        throw new Error('Message content cannot be empty');
    }
    const message = await messageModel.createMessage({
        conversationId,
        senderId: data.senderId,
        content: data.content,
    });
    return { message, conversationId };
}

export async function getConversationMessages(conversationId: string,userId:string,options?: {limit?: number; cursor?: string;}) {
    await conversationModel.getConversationById(conversationId,userId);
    const messages=await messageModel.getMessages(conversationId,userId,options);
    return messages;
}

export async function markAsRead(conversationId: string,userId: string) {
    await conversationModel.getConversationById(conversationId,userId);
    const result= await messageModel.markMessagesAsRead(conversationId,userId);
    return result;
}

export async function updateMessage(messageId: string,userId: string, newContent: string) {
    if(newContent.trim() === ''){
        throw new Error('Message content cannot be empty');
    }
    const updatedMessage = await messageModel.editMessage(messageId,userId, newContent.trim());
    return updatedMessage;
}

export async function getUserConversationsList(userId: string) {
    const conversations = await conversationModel.getUserConversations(userId);
    return conversations;
}

export async function startConversation(userId: string, recipientId: string) {
    if(userId === recipientId){
        throw new Error('Cannot start a conversation with yourself');
    }
    const conversation = await conversationModel.findOrCreateConversation(userId, recipientId);
    return conversation;
}

export async function archiveConversationById(conversationId: string, userId: string) {
    await conversationModel.getConversationById(conversationId,userId);
    return await conversationModel.archiveConversation(conversationId, userId);
}
export async function unarchiveConversationById(conversationId: string, userId: string) {
    await conversationModel.getConversationById(conversationId,userId);
    return await conversationModel.unarchiveConversation(conversationId, userId);
}

export async function deleteMessageById(messageId: string, userId: string) {
    return await messageModel.deleteMessage(messageId, userId);
}

export async function getUnreadCountsList(userId: string) {
    const conversationIds=await conversationModel.getActiveConversationIdsForUser(userId);

    const [perConversation,totalUnread]=await Promise.all([
        messageModel.getUnreadCountsByConversationIds(conversationIds,userId),
        messageModel.getTotalUnreadCountByConversationIds(conversationIds,userId),
    ]);
    return { perConversation, totalUnread };
}

export async function getRecipientUserIdsForConversation(conversationId: string, senderId: string) {
    const conversation = await conversationModel.getConversationById(conversationId, senderId);
    const ids = conversation.participants
        .map((p: { userId: string }) => p.userId)
        .filter((id: string) => id !== senderId);
    return Array.from(new Set(ids));
}