import {api} from './api';
import type {User} from '../App';

export const getConversations = async () => {
    const res=await api.get('/conversations');
    return res.data;
}

export const startConversation = async(recipientId: string) => {
    const res=await api.post('/conversations',{
        recipientId
    });
    return res.data;
}

export const archiveConversation = async(conversationId: string) => {
    const res=await api.put(`/conversations/${conversationId}/archive`);
    return res.data;
}

export const unarchiveConversation = async(conversationId: string) => {
    const res=await api.put(`/conversations/${conversationId}/unarchive`);
    return res.data;
}

export const markAsRead = async(conversationId: string) => {
    const res=await api.put(`/conversations/${conversationId}/read`);
    return res.data;
}

export const getConversationMessages = async(conversationId: string, limit?: number, cursor?: string) => {
    const params: any={};
    if(limit) params.limit=limit;
    if(cursor) params.cursor=cursor;
    const res=await api.get(`/conversations/${conversationId}/messages`, {params});
    return res.data;
}

export const sendMessage = async(conversationId: string | null, content: string) => {
    const res=await api.post(`/conversations/${conversationId}/messages`,{
        content
    });
    return res.data;
}   

export const editMessage = async(conversationId: string, messageId: string, newContent: string) => {
    const res=await api.put(`/conversations/${conversationId}/messages/${messageId}`,{
        newContent
    });
    return res.data;
}

export const deleteMessage = async(conversationId: string, messageId: string) => {
    const res=await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
    return res.data;
}