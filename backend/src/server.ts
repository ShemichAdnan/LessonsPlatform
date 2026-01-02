import 'dotenv/config';
import { createServer } from 'http';
import pino from 'pino';
import app from './app.js';
import { Server } from 'socket.io';
import * as messageService from './services/messageService.js';
import { socketAuth } from './middlewares/socketAuth.js';

const logger = pino({ transport: { target: 'pino-pretty' } });

const httpServer = createServer(app);

//socket
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5000', 'http://localhost:5001'],
        credentials: true
    }
});
io.use(socketAuth());
const onlineUsers = new Map <string, string>();

io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    const userId=socket.data.userId as string;
    if(!userId){
        //Ne bi se trebalo desiti zbog socketAuth middleware-a ali za svaki slucaj
        socket.disconnect();
        return;
    }

    onlineUsers.set(userId, socket.id);
    logger.info(`User ${userId} is online`);
    io.emit("onlineUsers",Array.from(onlineUsers.keys()));

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
        try{
            const senderId=socket.data.userId as string;
            const {conversationId, recipientId, content} = data;

            const result = await messageService.sendMessage({
                conversationId,
                recipientId,
                senderId,
                content,
            });
            socket.to(result.conversationId).emit("newMessage", result.message);
        
            if(callback) callback({ success: true, message: result.message });

  
            const recipients = recipientId
                ? [recipientId]
                : await messageService.getRecipientUserIdsForConversation(result.conversationId, senderId);

            for (const rid of recipients) {
                const socketId = onlineUsers.get(rid);
                if (!socketId) continue;
                io.to(socketId).emit("notification", {
                    type: 'new_message',
                    conversationId: result.conversationId,
                    message: result.message,
                });
            }
        } catch (err: any){
            if(callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("editMessage", async (data, callback) => {
        try {
            const userId = socket.data.userId as string;
            const { messageId, newContent } = data;

            const updated = await messageService.updateMessage(messageId, userId, newContent);

            io.to(updated.conversationId).emit("messageEdited", updated);
            if (callback) callback({ success: true, message: updated });
        } catch (err: any) {
            if (callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("deleteMessage", async (data, callback) => {
        try {
            const userId = socket.data.userId as string;
            const { messageId } = data;

            const deleted = await messageService.deleteMessageById(messageId, userId);

            io.to(deleted.conversationId).emit("messageDeleted", deleted);
            if (callback) callback({ success: true, message: deleted });
        } catch (err: any) {
            if (callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("markAsRead", async({conversationId},callback) => {
        try{
            const userId=socket.data.userId as string;
            const result = await messageService.markAsRead(conversationId, userId);
            socket.to(conversationId).emit("messagesRead", { conversationId, userId });
            if(callback) callback({ success: true, count: result.count });
        }catch(err: any){
            if(callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("getUnreadCount", async(_ignoredUserId: string,callback) => {
        try{
            const authedUserId=socket.data.userId as string;
            const { perConversation, totalUnread } = await messageService.getUnreadCountsList(authedUserId);

            if(callback) callback({ success: true, unreadCounts: perConversation, totalUnread  });
        } catch (err: any){
            if(callback) callback({ success: false, error: err.message });
        }
    });

    socket.on("getOnlineUsers", (callback) => {
        if(callback) callback(Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
        const userId=socket.data.userId as string | undefined;
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

