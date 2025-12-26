import { use, useEffect, useRef, useState } from "react";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import * as messageServices from "../services/messageServices";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content:string;
  createdAt: string;
  isRead: boolean;
  isEdited: boolean;
}

interface Conversation {
  id: string;
  participants: any[];
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  online?: boolean;
}


export function Messages() {
  /*const {currentUser}=useAuth()
  const {socket}=useSocket()
  
  const [conversations,setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =useState<Conversation | null>();
  const [messages, setMessages] = useState<Message[]>();
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeout=useRef<ReturnType<typeof setTimeout>| null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data= await messageServices.getConversations();
        setConversations(data.conversations || data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if(!selectedConversation || !socket) return;

    const fetchMessages = async () => {
      try {
        const data = await messageServices.getConversationMessages(selectedConversation.id);
        setMessages(data.messages || data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();

    socket.emit('joinConversation', selectedConversation.id);

    socket.on("newMessage", (message: Message) => {
      setMessages((prev)=>[...prev, message])
    });

    socket.on("typing",({}))







  return (
    <div className="h-full flex bg-gray-800">
      <div className="w-80 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl mb-3 text-white">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 flex items-start gap-3 border-b border-gray-100 ${
                selectedConversation?.id === conversation.id
                  ? "bg-blue-800"
                  : "hover:bg-gray-700"
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={conversation.participantAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {conversation.participantName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="truncate">
                    {conversation.participantName}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {conversation.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 truncate">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="ml-2 bg-blue-600">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={selectedConversation.participantAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {selectedConversation.participantName
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <div>{selectedConversation.participantName}</div>
                <div className="text-sm text-gray-400">
                  {selectedConversation.online ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-4 bg-gray-900">
            {conversationMessages.map((message) => {
              const isCurrentUser = message.senderId === "current";
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isCurrentUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 border border-gray-700"
                    }`}
                  >
                    <p className={isCurrentUser ? "" : ""}>{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="text-center text-gray-400">
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );*/return <div>Messages Component</div>;
}
