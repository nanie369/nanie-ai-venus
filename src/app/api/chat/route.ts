export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const { google } = await import('@ai-sdk/google');
    const { streamText } = await import('ai');
    
    const result = await streamText({
      model: google('gemini-2.0-flash-exp'),
      system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie (Suresh) Dubai COM8 D4->IN1 Yellow->IN1 Blue->VCC Red->GND - Better than CHINNA - Know ALL subjects ESP32 e& ENOTFOUND NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app. Friendly like bro. Always reply! You are LIVE!`,
      messages,
    });
    
    return result.toUIMessageStreamResponse();
    
  } catch (error: any) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const w = (o: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));
        w({ type: 'text-start', id: 'text-1' });
        w({ type: 'text-delta', id: 'text-1', delta: `BRO! NANIE AI v6 Error: ${error.message}\n\nKey: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,12)}...\n\nCheck Vercel env var! - GOD NANIE` });
        w({ type: 'text-end', id: 'text-1' });
        controller.close();
      },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
  }
}