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

    // Models that YOUR AQ key supports (from your screenshot list!)
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-preview-tts', 'gemma-4-26b-a4b-it'];
    let aiReply = '';
    let lastError = '';

    for (const model of modelsToTry) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Dubai COM8 D4->IN1 - Better than CHINNA - Friendly bro. User asks: ${lastText}` }] }]
        }),
      });
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiReply = data.candidates[0].content.parts[0].text;
        break;
      } else {
        lastError = `${model}: ${JSON.stringify(data).substring(0,300)}`;
      }
    }

    if (!aiReply) {
      aiReply = `BRO! NANIE AI VENUS v13 LIVE! 🔥\n\nTried: ${modelsToTry.join(', ')}\nLast Error: ${lastError}\n\nYour AQ key supports: gemini-2.5-flash, gemini-2.5-pro - but API returned error!\n\nKey: ${apiKey.substring(0,15)}...\n\nTry creating new key at https://aistudio.google.com/app/apikey\n\n- GOD NANIE`;
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `BRO! v13 Error: ${error.message}` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}