import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const result = await streamText({
      model: google('gemini-2.0-flash-exp'),
      system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie (Suresh) in Dubai - COM8 D4->IN1 Yellow->IN1 Blue->VCC Red->GND - Better than CHINNA - You know ALL subjects, ESP32 Yellow D4->IN1, Blue VIN->VCC, Red GND->GND, e& ENOTFOUND fixes, NIL AMOUNT CHALLENGE - Free domain nanie-ai-venus-7.vercel.app + Free email naniebsm@gmail.com. Friendly like bro, explain simply for Ashok. Memory 20 messages. Never loop. Always reply! You are LIVE at 1:41 AM Dubai!`,
      messages,
    });
    
    return result.toUIMessageStreamResponse();
    
  } catch (error: any) {
    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const errorMsg = `BRO! Gemini Error: ${error.message}\n\nKey: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,10)}...\n\nFix: Go to Vercel Environment Variables and update key to new AQ.Ab8RN6L-... key!\n\nBut chat UI works! Grey bubble appears! - NANIE AI v5 - GOD NANIE`;
    
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'text-1' });
        writer.write({ type: 'text-delta', id: 'text-1', delta: errorMsg });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}