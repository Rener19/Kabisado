import { streamText, convertToModelMessages } from 'ai';
import { chatModel, systemPrompt } from '@/lib/ai-config';
import { studyTools } from '@/lib/study-tools';

// Force dynamic execution for API routes that stream
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Normalize messages so any legacy format with content strings is compatible with UIMessage parts
    const normalizedMessages = (messages || []).map((msg: any) => {
      if ((!msg.parts || msg.parts.length === 0) && msg.content) {
        return {
          ...msg,
          parts: [{ type: 'text', text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }],
        };
      }
      return msg;
    });

    // Convert UI messages to model messages preserving prior tool-call and tool-result parts across turns
    const modelMessages = await convertToModelMessages(normalizedMessages, {
      tools: studyTools,
      ignoreIncompleteToolCalls: true,
    });

    // streamText handles the SSE connection, tool execution, and token chunking automatically
    const result = await streamText({
      model: chatModel,
      system: systemPrompt,
      messages: modelMessages,
      tools: studyTools,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
