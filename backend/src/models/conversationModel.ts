import {prisma} from '../utils/prisma.js';

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
                            avatarUrl: true,
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
                            avatarUrl: true,
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
                                avatarUrl: true,
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
                                avatarUrl: true,
                            }
                        }
                    }
                }
            }
        })
    }
    return conversation;
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
                            avatarUrl: true,
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
    return conversations;
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
                            avatarUrl: true,
                        }
                    }
                }
            },
        },
    });

    if(!conversation) {
        throw new Error('Conversation not found or access denied');
    }
    return conversation;
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

export async function getUnreadCount(conversationId: string,userId: string) {
    return await prisma.message.count({
        where: {
            conversationId,
            senderId: { not: userId },
            isRead: false,
            isDeleted: false,
        },
    });
}
        
    

