import {prisma} from '../utils/prisma.js';
import { withAvatarUrl } from '../utils/avatar.js';

export async function createMessage(data: {
    conversationId: string;
    senderId: string;
    content: string;
}) {
    const participant= await prisma.conversationParticipant.findFirst({
        where:{
            conversationId:data.conversationId,
            userId:data.senderId
        }
    });

    if(!participant){
        throw new Error('Sender is not a participant of the conversation');
    }

    const [message] = await prisma.$transaction([
        prisma.message.create({
            data:{
                conversationId: data.conversationId,
                senderId: data.senderId,
                content: data.content,
            },
            include:{
                sender:{
                    select:{
                        id:true,
                        name:true,
                        avatarMime:true,
                    }
                }
            }
        }),
        prisma.conversation.update({
            where:{ id: data.conversationId },
            data:{updatedAt: new Date() },
        }),
    ]);
    return {
        ...message,
        sender: withAvatarUrl(message.sender as any),
    };
}

export async function getMessages(conversationId: string,userId:string,options?: {limit?: number; cursor?: string;}) {
    const limit = options?.limit ?? 20;
    const participant =await prisma.conversationParticipant.findFirst({
        where:{
            conversationId:conversationId,
            userId:userId
        }
    });
    if(!participant){
        throw new Error('User is not a participant of the conversation');
    }

    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(options?.cursor && { skip: 1, cursor: { id: options.cursor } }),
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    avatarMime: true,
                }
            }
        }
    });

    return messages.reverse().map(m => ({
        ...m,
        sender: withAvatarUrl(m.sender as any),
    }));
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
    return await prisma.message.updateMany({
        where: {
            conversationId,
            senderId: { not: userId },
            isRead: false,
            isDeleted: false,
        },
        data: {
            isRead: true,
        },
    });
}   

export async function deleteMessage(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
        where: { id: messageId },
    });
    if (!message) {
        throw new Error('Message not found');
    }
    if (message.senderId !== userId) {
        throw new Error('User is not the sender of the message');
    }

    const updated = await prisma.message.update({
        where: { id: messageId },
        data: { isDeleted: true, deletedAt: new Date(), content: '' },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    avatarMime: true,
                }
            }
        }
    });

    return {
        ...updated,
        sender: withAvatarUrl(updated.sender as any),
    };
}

export async function editMessage(messageId: string, userId: string, newContent: string) {
    const message = await prisma.message.findUnique({
        where: { id: messageId },
    });
    if (!message) {
        throw new Error('Message not found');
    }
    if (message.senderId !== userId) {
        throw new Error('User is not the sender of the message');
    }
    const updated = await prisma.message.update({
        where: { id: messageId },
        data: { content: newContent, isEdited: true ,editedAt: new Date()},
        include:{
            sender:{
                select:{
                    id:true,
                    name:true,
                    avatarMime:true,
                }
            }
        }
    });

    return {
        ...updated,
        sender: withAvatarUrl(updated.sender as any),
    };
}

export async function getUnreadCountsByConversationIds(conversationIds: string[], userId: string) {
    if(conversationIds.length === 0){
        return [];
    }
    const grouped =await prisma.message.groupBy({
        by: ['conversationId'],
        where: {
            conversationId: { in: conversationIds },
            senderId: { not: userId },
            isRead: false,
            isDeleted: false,
        },
        _count: {
            _all: true,
        },
    });
    return grouped.map(g => ({
        conversationId: g.conversationId,
        unread: g._count._all,
    }));
}

export async function getTotalUnreadCountByConversationIds(conversationIds: string[], userId: string) {
    if(conversationIds.length === 0){
        return 0;
    }
    return await prisma.message.count({
        where: {
            conversationId: { in: conversationIds },
            senderId: { not: userId },
            isRead: false,
            isDeleted: false,
        },  
    });
}
