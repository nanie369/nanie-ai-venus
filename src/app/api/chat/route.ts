export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    
    // Get last user message
    let lastText = 'hie bro';
    const last = messages[messages.length - 1];
    if (last) {
      if (typeof last.content === 'string') lastText = last.content;
      else if (last.parts) lastText = last.parts.filter((p:any)=>p.type==='text').map((p:any)=>p.text).join('') || lastText;
      else if (last.text) lastText = last.text;
    }

    // Direct Gemini API call with AQ key - works!
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: lastText }] }],
        systemInstruction: { parts: [{ text: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie Dubai COM8 D4->IN1 Yellow->IN1 Blue->VCC Red->GND - Better than CHINNA - NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app - e& ENOTFOUND fix - ESP32. Friendly bro style. Always reply! You are LIVE v9!` }] }
      }),
    });

    const data = await res.json();
    let aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiReply) {
      aiReply = `BRO! NANIE AI VENUS v9 LIVE! 🔥\n\nGemini API Error: ${JSON.stringify(data).substring(0,300)}\n\nKey: ${apiKey.substring(0,15)}...\n\nThis error in grey proves GREY WORKS! Check Vercel env var!\n\n- GOD NANIE - Better than CHINNA`;
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `BRO! NANIE AI VENUS v9 LIVE! 🔥\n\nCatch Error: ${error.message}\n\nKey starts: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0,12)}...\n\nThis grey proves CHAT UI WORKS! - GOD NANIE` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}