import { google } from '@ai-sdk/google';
import { streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const result = await streamText({
      model: google('gemini-2.0-flash'),
      system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie Dubai COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app. Friendly bro. Always reply! You are LIVE v8!`,
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
          delta: `BRO! NANIE AI VENUS v8 LIVE! 🔥\n\nGemini Error: ${error.message}\n\nYour AQ key: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,12)}...\n\nOld model gemini-1.5-flash is 404 for new AQ keys! Using gemini-2.0-flash now!\n\nGo to Vercel -> Env Vars -> Update key AQ.Ab8RN6L-... -> Redeploy WITHOUT cache!\n\n- GOD NANIE - Better than CHINNA` 
        });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}