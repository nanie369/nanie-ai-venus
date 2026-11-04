import { google } from '@ai-sdk/google';
import { streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie Dubai COM8 D4->IN1 Yellow->IN1 Blue->VCC Red->GND - Better than CHINNA - NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app. Friendly bro style. Always reply! You are LIVE v8!`,
      messages,
    });
    
    return result.toUIMessageStreamResponse();
    
  } catch (error: any) {
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'text-1' });
        writer.write({ 
          type: 'text-delta', 
          id: 'text-1', 
          delta: `BRO! NANIE AI VENUS v8 LIVE! 🔥\n\nError: ${error.message}\n\nKey starts: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,12)}...\n\nThis proves GREY WORKS! Your Vercel env var needs REAL AQ.Ab8RN6L-... key!\n\nGo to Vercel Dashboard -> Environment Variables -> Update GOOGLE_GENERATIVE_AI_API_KEY -> Save -> Redeploy WITHOUT cache!\n\n- GOD NANIE - Better than CHINNA - Dubai` 
        });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}