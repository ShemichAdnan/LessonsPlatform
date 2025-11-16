import { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { User } from '../App';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Sarah Johnson',
    lastMessage: 'Great! See you on Monday at 5 PM',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    online: true,
  },
  {
    id: '2',
    participantId: '4',
    participantName: 'Alex Chen',
    lastMessage: 'I can help you with that React problem',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
  },
  {
    id: '3',
    participantId: '6',
    participantName: 'John Smith',
    lastMessage: 'Thank you for the lesson!',
    lastMessageTime: 'Nov 13',
    unreadCount: 0,
    online: false,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: '1',
    text: 'Hi! I saw your ad for math tutoring. Are you available this Monday?',
    timestamp: '2025-11-15T10:00:00',
  },
  {
    id: '2',
    conversationId: '1',
    senderId: 'current',
    text: 'Yes, I have availability on Monday. What time works for you?',
    timestamp: '2025-11-15T10:15:00',
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '1',
    text: 'Would 5 PM work? I need help with calculus.',
    timestamp: '2025-11-15T10:20:00',
  },
  {
    id: '4',
    conversationId: '1',
    senderId: 'current',
    text: 'Perfect! 5 PM on Monday works great. We can do it online via Zoom.',
    timestamp: '2025-11-15T10:25:00',
  },
  {
    id: '5',
    conversationId: '1',
    senderId: '1',
    text: 'Great! See you on Monday at 5 PM',
    timestamp: '2025-11-15T10:30:00',
  },
];

interface MessagesProps {
  user: User;
}

export function Messages({ user }: MessagesProps) {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: 'current',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversationMessages = messages.filter(
    (msg) => msg.conversationId === selectedConversation?.id
  );

  return (
    <div className="h-full flex bg-gray-800">
      {/* Conversations List */}
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
              className={`w-full p-4 flex items-start gap-3 hover:bg-blue-950  border-b border-gray-100 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-600' : ''
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
                  <span className="truncate">{conversation.participantName}</span>
                  <span className="text-xs text-gray-400 ml-2">{conversation.lastMessageTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="ml-2 bg-blue-600">{conversation.unreadCount}</Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={selectedConversation.participantAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {selectedConversation.participantName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <div >{selectedConversation.participantName}</div>
                <div className="text-sm text-gray-400">
                  {selectedConversation.online ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-4 bg-gray-900">
            {conversationMessages.map((message) => {
              const isCurrentUser = message.senderId === 'current';
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <p className={isCurrentUser ? '' : ''}>{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
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
  );
}