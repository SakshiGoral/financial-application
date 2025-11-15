'use client';

import { useState, useRef, useEffect } from 'react';
import { useData } from '@/contexts/data-context';
import { Loader2, MessageCircle, Send, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Card3D from '../shared/card-3d';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export default function ChatInterface() {
  const { chatHistory, askAiAssistant, getAudioForText } = useData();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input;
    setInput('');
    setLoading(true);
    await askAiAssistant(question);
    setLoading(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePlayAudio = async (text: string, id: string) => {
    if (playingAudio === id) {
      audioRef.current?.pause();
      setPlayingAudio(null);
      return;
    }
  
    setPlayingAudio(id);
    const audioSrc = await getAudioForText(text);
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingAudio(null);
    } else {
      setPlayingAudio(null);
    }
  };

  return (
    <Card3D>
       <audio ref={audioRef} />
      <div className="h-[calc(100vh-10rem)] min-h-[500px] rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl flex flex-col">
        <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
          <MessageCircle className="h-6 w-6 text-primary" />
          FinTrack AI
        </h3>
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
            {chatHistory.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <MessageCircle className="mx-auto mb-4 h-16 w-16 opacity-50" />
                <p className="text-lg">Ask me anything about your finances!</p>
                <p className="text-sm mt-2">e.g., "How much did I spend on food this month?"</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[85%] rounded-2xl p-4 break-words group relative', msg.role === 'user' ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-tl-none bg-secondary')}>
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    {msg.role === 'assistant' && (
                       <Button
                       size="icon"
                       variant="ghost"
                       className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                       onClick={() => handlePlayAudio(msg.content, `msg-${i}`)}
                     >
                        <Volume2 className="h-4 w-4" />
                     </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
                <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-4 bg-secondary flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
        <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card3D>
  );
}
