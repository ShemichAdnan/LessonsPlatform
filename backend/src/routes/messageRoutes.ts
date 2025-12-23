import { Router } from "express";

import * as messageController from "../controllers/messageController.js";
import { authGuard } from "../middlewares/auth.js";

const router = Router();
router.use(authGuard);

router.post("/",messageController.startConversationHandler);
router.get("/",messageController.getConversationsHandler)

router.put("/:conversationId/archive", messageController.archiveConversationHandler);
router.put("/:conversationId/unarchive", messageController.unarchiveConversationHandler);
router.put("/:conversationId/read", messageController.markAsReadHandler);

router.get("/:conversationId/messages", messageController.getMessagesHandler);
router.post("/:conversationId/messages",messageController.sendMessageHandler);
router.patch("/:conversationId/messages/:messageId", messageController.editMessageHandler);
router.delete("/:conversationId/messages/:messageId", messageController.deleteMessageHandler);

export default router;
