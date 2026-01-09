import {prisma} from '../utils/prisma.js';
import { withAvatarUrl } from '../utils/avatar.js';

function normalizeConversation(conversation: any) {
    if (!conversation) return conversation;
    return {
        ...conversation,
        participants: conversation.participants?.map((p: any) => ({
            ...p,
            user: p.user ? withAvatarUrl(p.user) : p.user,
        })),
        messages: conversation.messages
            ? conversation.messages.map((m: any) => ({
                ...m,
                sender: m.sender ? withAvatarUrl(m.sender) : m.sender,
            }))
            : conversation.messages,
    };
}

export async function findOrCreateConversation(userId1: string, userId2: string) {
    let participantIds = [userId1, userId2].sort();     
    let conversation = await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: {some: { userId: participantIds[0] } } },
                { participants: {some: { userId: participantIds[1] } } }
            ],
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatarMime: true,
                        }
                    }
                }
            },
            messages: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1,
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            avatarMime: true,
                        }
                    }
                }   
            }
        }
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data:{
                participants: {
                   create: [
                        { userId: participantIds[0] },
                        { userId: participantIds[1] }
                    ],
                },
            },
            include:{
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatarMime: true,
                            }
                        }
                    }
                },
                messages: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                avatarMime: true,
                            }
                        }
                    }
                }
            }
        })
    }
    return normalizeConversation(conversation);
}

export async function getUserConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: { some: { userId,isArchived: false } }
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatarMime: true,
                        }
                    }
                }
            },
            messages: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1,
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }   
            },
            _count:{
                select:{messages:true}
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
    return conversations.map(c => normalizeConversation(c));
}


export async function getConversationById(conversationId: string,userId: string) {
    const conversation = await prisma.conversation.findFirst({
        where: { 
            id: conversationId ,
            participants: { some: { userId } } 
        },
        include: {
            participants: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatarMime: true,
                        }
                    }
                }
            },
        },
    });

    if(!conversation) {
        throw new Error('Conversation not found or access denied');
    }
    return normalizeConversation(conversation);
}

export async function archiveConversation(conversationId: string, userId: string) {
    const participant = await prisma.conversationParticipant.findFirst({
        where: {
            conversationId,
            userId,
        }
    });
        
    if(!participant) {
        throw new Error("Participant not found");
    }

    return prisma.conversationParticipant.update({
        where: {
            id: participant.id,
        },
        data: {
            isArchived: true,
            archivedAt: new Date(),
        }
    });
}

export async function unarchiveConversation(conversationId: string, userId: string) {
    const participant = await prisma.conversationParticipant.findFirst({
        where: {
            conversationId,
            userId,
        }
    });
    if(!participant) {
        throw new Error("Participant not found");
    }
    return prisma.conversationParticipant.update({
        where: {
            id: participant.id,
        },
        data: {
            isArchived: false,
            archivedAt: null,
        }
    });
}  


export async function getActiveConversationIdsForUser(userId: string) {
    const rows = await prisma.conversationParticipant.findMany({
        where: {
            userId,
            isArchived: false,
        },
        select: {
            conversationId: true,
        }
    });
    return rows.map(r => r.conversationId);
}
        
    

