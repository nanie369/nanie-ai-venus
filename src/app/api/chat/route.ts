export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    
    let lastText = 'hie bro';
    const last = messages[messages.length - 1];
    if (last) {
      if (typeof last.content === 'string') lastText = last.content;
      else if (last.parts) lastText = last.parts.filter((p:any)=>p.type==='text').map((p:any)=>p.text).join('') || lastText;
      else if (last.text) lastText = last.text;
    }

    // Try gemini-2.0-flash - works with AQ keys!
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: lastText }] }],
        systemInstruction: { parts: [{ text: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie Dubai COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app - e& ENOTFOUND fix - ESP32 Yellow D4->IN1. Friendly bro style. Always reply concisely!` }] }
      }),
    });

    const data = await res.json();
    let aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiReply) {
      // Try fallback model gemini-1.5-flash if 2.0-flash fails
      const res2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: lastText }] }],
          systemInstruction: { parts: [{ text: `You are NANIE AI VENUS - Dubai - Better than CHINNA` }] }
        }),
      });
      const data2 = await res2.json();
      aiReply = data2?.candidates?.[0]?.content?.parts?.[0]?.text || `BRO! NANIE AI VENUS v10 LIVE! 🔥\n\nError: ${JSON.stringify(data).substring(0,400)}\n\nFallback Error: ${JSON.stringify(data2).substring(0,200)}\n\nKey: ${apiKey.substring(0,15)}...\n\n- GOD NANIE`;
    }

    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'text-1' });
        writer.write({ type: 'text-delta', id: 'text-1', delta: aiReply });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });

  } catch (error: any) {
    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'text-1' });
        writer.write({ type: 'text-delta', id: 'text-1', delta: `BRO! NANIE AI v10 Error: ${error.message} - GOD NANIE` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}