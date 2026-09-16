import React from 'react';
import { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { ToolPartRenderer } from './tools/ToolPartRenderer';

interface ChatMessageProps {
  message: UIMessage;
  isLatest: boolean;
}

export const ChatMessage = React.memo(function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  const parts: any[] =
    Array.isArray((message as any).parts) && (message as any).parts.length > 0
      ? (message as any).parts
      : (message as any).content
        ? [{ type: 'text', text: typeof (message as any).content === 'string' ? (message as any).content : JSON.stringify((message as any).content) }]
        : [];
  
  // Extract text content for thinking detection
  const hasText = parts.some((p) => p.type === 'text' && p.text && p.text.trim().length > 0);
  const hasTools = parts.some(
    (p) =>
      (typeof p.type === 'string' && (p.type.startsWith('tool-') || p.type === 'dynamic-tool')) ||
      p.toolCallId ||
      p.state
  );

  // If assistant is generating but no text/tools have arrived yet
  const isThinking = !isUser && isLatest && !hasText && !hasTools;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex w-full max-w-[95%] md:max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-emerald-900 text-emerald-100'
        }`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        {/* Message Bubble & Content Area */}
        <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'} min-w-0 flex-1`}>
          <span className="text-xs text-muted-foreground font-medium px-1">
            {isUser ? 'You' : 'Kabisado'}
          </span>
          
          <div className="w-full space-y-3">
            <AnimatePresence mode="wait">
              {isThinking ? (
                <div className="inline-block px-4 py-3 rounded-2xl bg-card border border-border text-card-foreground rounded-tl-sm shadow-sm">
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, position: 'absolute' }}
                    className="flex items-center gap-1.5 h-6 text-emerald-500"
                  >
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-current"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </motion.div>
                </div>
              ) : parts.length > 0 ? (
                parts.map((part, idx) => {
                  const isToolPart =
                    (typeof part.type === 'string' &&
                      (part.type.startsWith('tool-') || part.type === 'dynamic-tool')) ||
                    part.toolCallId ||
                    part.state;

                  if (isToolPart) {
                    return <ToolPartRenderer key={`${message.id}-tool-${part.toolCallId || idx}`} part={part} />;
                  }

                  if (part.type === 'text' && part.text) {
                    return (
                      <div
                        key={`${message.id}-text-${idx}`}
                        className={`inline-block px-4 py-3 rounded-2xl ${
                          isUser
                            ? 'bg-primary text-primary-foreground rounded-tr-sm float-right'
                            : 'bg-card border border-border text-card-foreground rounded-tl-sm shadow-sm'
                        }`}
                      >
                        <div
                          className={`prose prose-sm md:prose-base dark:prose-invert max-w-none break-words ${
                            isUser
                              ? 'text-primary-foreground prose-p:text-primary-foreground prose-a:text-primary-foreground/80'
                              : ''
                          }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                              a: ({ node, ...props }) => (
                                <a
                                  {...props}
                                  className="text-emerald-500 hover:underline"
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              ),
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

