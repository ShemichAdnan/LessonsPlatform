import {Request, Response} from 'express';
import * as messageService from '../services/messageService.js';

export async function sendMessageHandler(req: Request, res: Response) {
    try {
        const {conversationId,recipientId,content}=req.body;
        const senderId = (req as any).user.id;
        const result= await messageService.sendMessage({
            conversationId,
            recipientId,
            senderId,
            content,
        });
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message});
    } 
}

export async function getMessagesHandler(req: Request, res: Response) {
    try {
        const conversationId=req.params.conversationId;
        const userId=(req as any).user.id;
        const limit= req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const cursor= req.query.cursor as string | undefined;

        const messages= await messageService.getConversationMessages(conversationId,userId, {limit, cursor});
        res.json({ messages });
    }catch (err: any) {
        res.status(400).json({ message: err.message });
    }
}

export async function markAsReadHandler(req: Request, res: Response) {
    try {
        const conversationId = req.params.conversationId;
        const userId = (req as any).user.id;

        const result = await messageService.markAsRead(conversationId, userId);
        res.json({ success: true, count: result.count });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function editMessageHandler(req: Request, res: Response) {
    try {
        const messageId = req.params.messageId;
        const userId = (req as any).user.id;
        const newContent = req.body.newContent;

        const result = await messageService.updateMessage(messageId, userId, newContent);
        res.json({ message: result });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }   
}

export async function getConversationsHandler(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        const conversations = await messageService.getUserConversationsList(userId);
        res.json({ conversations });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }   
}

export async function deleteMessageHandler(req: Request, res: Response) {
    try{
        const messageId=req.params.messageId;
        const userId=(req as any).user.id;

        await messageService.deleteMessageById(messageId,userId);
        res.json({success: true, message: "Message deleted"});
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
}

export async function startConversationHandler(req: Request, res: Response) {
    try{
        const userId=(req as any).user.id;
        const recipientId=req.body.recipientId;

        const conversation= await messageService.startConversation(userId, recipientId);
        res.status(201).json(conversation);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
}

export async function archiveConversationHandler(req: Request, res: Response) {
    try{
        const conversationId=req.params.conversationId;
        const userId=(req as any).user.id;

        await messageService.archiveConversationById(conversationId, userId);

        res.json({ success: true, message: 'Conversation archived'});
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
}

export async function unarchiveConversationHandler(req: Request, res: Response) {
    try{
        const conversationId=req.params.conversationId;
        const userId=(req as any).user.id;
        await messageService.unarchiveConversationById(conversationId, userId);

        res.json({ success: true, message: 'Conversation unarchived'});
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
}

