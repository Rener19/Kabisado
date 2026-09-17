import { streamText, convertToModelMessages } from 'ai';
import { chatModel, systemPrompt } from '@/lib/ai-config';
import { studyTools } from '@/lib/study-tools';

// Force dynamic execution for API routes that stream
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const sabotage = url.searchParams.get('sabotage') || req.headers.get('x-sabotage');

    // Sabotage Testing Scenarios for Checkpoint 1
    if (sabotage === '429') {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded: 429 Too Many Requests. Gemini API quota has been temporarily throttled.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (sabotage === '500') {
      return new Response(
        JSON.stringify({ error: 'Internal Server Error (500): Route handler failure simulated for sabotage testing.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (sabotage === 'stream_abort') {
      const encoder = new TextEncoder();
      const customStream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"start"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"text-start","id":"0"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"text-delta","id":"0","delta":"Analyzing your study request..."}\n\n'));
          await new Promise((r) => setTimeout(r, 400));
          controller.error(new Error('Connection dropped mid-stream: Network socket disconnected unexpectedly.'));
        },
      });
      return new Response(customStream, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

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

    return result.toUIMessageStreamResponse({
      onError: (err) => (err instanceof Error ? err.message : String(err)),
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
