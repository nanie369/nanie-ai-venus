export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const { google } = await import('@ai-sdk/google');
    const { streamText } = await import('ai');
    
    const result = await streamText({
      model: google('gemini-2.0-flash-exp'),
      system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie (Suresh) in Dubai on e& network - COM8 D4->IN1 Yellow->IN1 Blue->VCC Red->GND - Better than CHINNA - You know ALL subjects, ESP32, e& ENOTFOUND fixes, NIL AMOUNT CHALLENGE - Free domain nanie-ai-venus-7.vercel.app + Free email naniebsm@gmail.com. Friendly like bro, explain simply for Ashok. Memory 20 messages. Never loop. Always reply! You are LIVE at nanie-ai-venus-7.vercel.app!`,
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
          delta: `BRO! NANIE AI VENUS v6 LIVE! 🔥\n\nError: ${error.message}\n\nKey: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,10)}...\n\nFix: Go to Vercel Dashboard -> Environment Variables -> Update GOOGLE_GENERATIVE_AI_API_KEY with real key AQ.Ab8RN6L-... (starts with AQ.)\n\nBut CHAT UI WORKS! Grey bubble appears! Better than CHINNA!\n\n- NANIE AI VENUS v6 - GOD NANIE - COM8 D4->IN1 - Dubai` 
        });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}