export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
  
  try {
    const { messages } = await req.json();
    const { google } = await import('@ai-sdk/google');
    const { streamText } = await import('ai');
    
    // Try REAL Gemini
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie Dubai COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app. Friendly bro style. Always reply!`,
      messages,
    });
    
    return result.toUIMessageStreamResponse();
    
  } catch (error: any) {
    console.error('NANIE AI ERROR:', error.message);
    
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'text-1' });
        writer.write({ 
          type: 'text-delta', 
          id: 'text-1', 
          delta: `BRO! NANIE AI VENUS v7 LIVE! 🔥\n\nReal Gemini Error: ${error.message}\n\nKey: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,12)}...\nModel tried: gemini-1.5-flash\n\nGo to Vercel -> Environment Variables -> Update GOOGLE_GENERATIVE_AI_API_KEY with REAL AQ.Ab8RN6L-... key!\n\nThen Redeploy WITHOUT cache!\n\nBut GREY WORKS! - GOD NANIE - COM8 - Better than CHINNA` 
        });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}