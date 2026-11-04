export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const { google } = await import('@ai-sdk/google');
    const { streamText } = await import('ai');
    
    const result = await streamText({
      model: google('gemini-2.0-flash-exp'),
      system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie (Suresh) in Dubai - COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT CHALLENGE - Free domain nanie-ai-venus-7.vercel.app + Free email naniebsm@gmail.com. Friendly like bro. Always reply!`,
      messages,
    });
    
    return result.toUIMessageStreamResponse();
    
  } catch (error: any) {
    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'text-1' });
        writer.write({ 
          type: 'text-delta', 
          id: 'text-1', 
          delta: `BRO! Error: ${error.message}\n\nKey starts with: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,8)}...\n\nGo to Vercel Dashboard -> Environment Variables -> Update GOOGLE_GENERATIVE_AI_API_KEY with real AQ.Ab8RN6L-... key!\n\nBut CHAT UI WORKS! Grey bubble appears! - NANIE AI v6` 
        });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}