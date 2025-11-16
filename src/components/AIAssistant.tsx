import { useState } from 'react';
import { Sparkles, Send, BookOpen, FileText, Calculator, Brain, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import type { User } from '../App';


interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIAssistantProps {
  user: User;
}

const quickPrompts = [
  {
    icon: Calculator,
    label: 'Solve Math Problem',
    prompt: 'Help me solve this math problem step by step:',
  },
  {
    icon: BookOpen,
    label: 'Explain Concept',
    prompt: 'Explain this concept in simple terms:',
  },
  {
    icon: FileText,
    label: 'Summarize Text',
    prompt: 'Summarize this text for me:',
  },
  {
    icon: Brain,
    label: 'Study Plan',
    prompt: 'Create a study plan for:',
  },
  {
    icon: Lightbulb,
    label: 'Practice Questions',
    prompt: 'Generate practice questions for:',
  },
];

export function AIAssistant({ user }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi ${user.name}! I'm your AI learning assistant. I can help you with:\n\n• Solving math and physics problems\n• Explaining complex concepts\n• Creating study plans\n• Generating practice questions\n• Summarizing text and articles\n• Reviewing your work\n\nWhat would you like help with today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about: "${input}"\n\nThis is a demo of the AI assistant feature. In a production environment, this would connect to an AI API (like OpenAI) to provide:\n\n• Step-by-step problem solutions\n• Detailed explanations\n• Personalized study recommendations\n• Practice exercises\n• And much more!\n\nWould you like to explore another question?`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt + ' ');
  };

  return (
    <div className="h-full flex bg-gray-900">
      {/* Sidebar with Quick Actions */}
      <div className="w-80 border-r border-gray-700 bg-gray-800 p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl text-white">AI Assistant</h2>
          </div>
          <p className="text-sm text-gray-400">
            Your personal AI tutor, available 24/7
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-white">Quick Actions</h3>
          <div className="space-y-2">
            {quickPrompts.map((prompt) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={prompt.label}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-purple-300 hover:bg-purple-900/20 transition-colors text-left"
                >
                  <Icon className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">{prompt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Card className="bg-gray-700">
          <CardHeader>
            <CardTitle className="text-base text-white">Tutor Tools</CardTitle>
            <CardDescription className="text-xs text-gray-400">
              AI-powered teaching assistants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generate Lesson Plan
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Brain className="w-4 h-4 mr-2" />
              Review Student Work
            </Button>
          </CardContent>
        </Card>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" >Beta</Badge>
            <span className="text-xs text-gray-400">Powered by AI</span>
          </div>
          <p className="text-xs text-gray-400">
            AI responses are for educational purposes and should be verified with your tutor or instructor.
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl px-5 py-3'
                    : 'space-y-2'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-400">AI Assistant</span>
                  </div>
                )}
                <div
                  className={
                    message.role === 'assistant'
                      ? 'bg-gray-800 rounded-2xl px-5 py-3 border border-gray-700'
                      : ''
                  }
                >
                  <p className={`whitespace-pre-line ${message.role === 'assistant' ? '' : ''}`}>{message.content}</p>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-400">AI Assistant</span>
                </div>
                <div className="bg-gray-800 rounded-2xl px-5 py-3 border border-gray-700">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-800 border-t border-gray-700">
          <form onSubmit={handleSend} className="space-y-3">
            <Textarea
              placeholder="Ask me anything... (e.g., 'Explain quadratic equations' or 'Help me with this physics problem')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              className="resize-none text-white placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Press Enter to send, Shift+Enter for new line
              </p>
              <Button type="submit" disabled={!input.trim() || isLoading}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}