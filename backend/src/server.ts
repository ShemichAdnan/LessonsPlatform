import 'dotenv/config';
import { createServer } from 'http';
import pino from 'pino';
import app from './app.js';
import { Server } from 'socket.io';
import * as messageService from './services/messageService.js';

const logger = pino({ transport: { target: 'pino-pretty' } });

const httpServer = createServer(app);

//socket
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5000', 'http://localhost:5001'],
        credentials: true
    }
});
const onlineUsers = new Map <string, string>();

io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on("login", (userId: string) => {
        onlineUsers.set(userId,socket.id);
        socket.data.userId=userId;
        logger.info(`User ${userId} is online`);
        io.emit("onlineUsers",Array.from(onlineUsers.keys()));
    });

    socket.on("joinConversation", (conversationId: string) => {
        socket.join(conversationId);
        logger.info(`User ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("leaveConversation", (conversationId: string) => {
        socket.leave(conversationId);
        logger.info(`User ${socket.id} left conversation ${conversationId}`);
    });

    socket.on("typing", (data: { conversationId: string; isTyping: boolean }) => {
        socket.to(data.conversationId).emit("typing", { userId: socket.data.userId, isTyping: data.isTyping});
    });

    socket.on("sendMessage", async(data,callback) => {
        if (!socket.data.userId) {
            if (callback) callback({ success: false, error: "Unauthorized" });
            return;
        }
        try{
            const senderId=socket.data.userId;
            const {conversationId, recipientId, content} = data;

            const result = await messageService.sendMessage({
                conversationId,
                recipientId,
                senderId,
                content,
            });
            socket.to(result.conversationId).emit("newMessage", result.message);
        
            if(callback) callback({ success: true, message: result.message });
        
            if(recipientId && onlineUsers.has(recipientId)){
                io.to(onlineUsers.get(recipientId)!).emit("notification", {
                    type: 'new_message',
                    conversationId: result.conversationId,
                    message: result.message,
                });
            }
        } catch (err: any){
            if(callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("markAsRead", async({conversationId},callback) => {
        if (!socket.data.userId) {
            if (callback) callback({ success: false, error: "Unauthorized" });
            return;
        }
        try{
            const userId=socket.data.userId;
            const result = await messageService.markAsRead(conversationId, userId);
            socket.to(conversationId).emit("messagesRead", { conversationId, userId });
            if(callback) callback({ success: true, count: result.count });
        }catch(err: any){
            if(callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("getUnreadCount", async(userId: string,callback) => {
        if (!socket.data.userId) {
            if (callback) callback({ success: false, error: "Unauthorized" });
            return;
        }
        try{
            const conversations = await messageService.getUserConversationsList(userId);
            const unreadCounts = conversations.map(conv =>({
                conversationId: conv.id,
                unread: conv._count?.messages ?? 0
            }));
            if(callback) callback({ success: true, unreadCounts });
        } catch (err: any){
            if(callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("getOnlineUsers", (callback) => {
        if (!socket.data.userId) {
            if (callback) callback({ success: false, error: "Unauthorized" });
            return;
        }
        if(callback) callback(Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
        if (!socket.data.userId) {
            return;
        }
        const userId=socket.data.userId;
        if(userId){
            onlineUsers.delete(userId);
            io.emit("onlineUsers",Array.from(onlineUsers.keys()));
            logger.info(`User ${userId} disconnected`);
        }
        logger.info(`Client disconnected: ${socket.id}`);
    });
});


const PORT = Number(process.env.PORT || 4000);
httpServer.listen(PORT, () => logger.info(`API on http://localhost:${PORT}`));

