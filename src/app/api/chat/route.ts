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

    // Try models in order: 2.5-flash, 3.8-flash, 2.0-flash-lite - all new models work with AQ keys!
    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash-lite'];
    let aiReply = '';
    let lastError = '';

    for (const model of modelsToTry) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: lastText }] }],
          systemInstruction: { parts: [{ text: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie Dubai COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app - e& ENOTFOUND fix - ESP32. Friendly bro style. Always reply!` }] }
        }),
      });
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiReply = data.candidates[0].content.parts[0].text;
        break;
      } else {
        lastError = JSON.stringify(data).substring(0,400);
      }
    }

    if (!aiReply) {
      aiReply = `BRO! NANIE AI VENUS v11 LIVE! 🔥\n\nTried models: ${modelsToTry.join(', ')}\nLast Error: ${lastError}\n\nKey: ${apiKey.substring(0,15)}...\n\nGoogle retired old models for new AQ keys! Trying new models!\n\n- GOD NANIE - Better than CHINNA`;
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `BRO! NANIE AI v11 Error: ${error.message} - GOD NANIE` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}