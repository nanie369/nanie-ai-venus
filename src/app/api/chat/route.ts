export const runtime = 'nodejs';

export async function POST() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const write = (obj: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      write({ type: 'text-start', id: 'text-1' });
      write({ 
        type: 'text-delta', 
        id: 'text-1', 
        delta: `Hie bro! NANIE AI VENUS v6 LIVE! 🔥\n\nGrey bubble works! ✅\n\nYou had placeholder key AIzaSyB-aBcD... - Need real key AQ.Ab8RN6L-...\n\nGo to Vercel Dashboard -> Environment Variables -> Edit GOOGLE_GENERATIVE_AI_API_KEY -> Paste real AQ.Ab8RN6L-... key -> Save -> Redeploy!\n\nThen change route.ts back to real Gemini code!\n\n- GOD NANIE - COM8 D4->IN1 - Dubai - Better than CHINNA - NIL AMOUNT WIN!` 
      });
      write({ type: 'text-end', id: 'text-1' });
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: { 
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    },
  });
}