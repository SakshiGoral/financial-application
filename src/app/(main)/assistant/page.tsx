'use client';

import { useState } from 'react';
import { Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/data-context';
import Card3D from '@/components/shared/card-3d';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { askFinancialQuestion } = useData();


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await askFinancialQuestion(input);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'ai',
        text: "Sorry, I'm having trouble connecting. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card3D>
      <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-border bg-card/80 shadow-lg backdrop-blur-xl">
        <div className="border-b p-4 text-center">
          <h1 className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-extrabold text-transparent">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Financial Assistant
          </h1>
          <p className="text-sm text-muted-foreground">Ask me anything about your finances!</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'ai' && (
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-sm rounded-2xl px-4 py-3 text-sm md:max-w-md lg:max-w-lg',
                    msg.sender === 'user'
                      ? 'rounded-br-none bg-primary text-primary-foreground'
                      : 'rounded-bl-none bg-secondary'
                  )}
                >
                  {msg.text}
                </div>
                 {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="rounded-2xl rounded-bl-none bg-secondary px-4 py-3 text-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., How much did I spend on shopping this month?"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="font-bold">
              Send
            </Button>
          </form>
        </div>
      </div>
    </Card3D>
  );
}
