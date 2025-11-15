import ChatInterface from '@/components/assistant/chat-interface';
import { DataProvider } from '@/contexts/data-context';

export default function AssistantPage() {
  return (
    <DataProvider>
      <ChatInterface />
    </DataProvider>
  );
}
