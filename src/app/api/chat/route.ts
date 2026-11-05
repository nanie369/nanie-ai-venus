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

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-pro'];
    let aiReply = '';
    let allErrors = '';

    for (const model of modelsToTry) {
      // Try v1beta first - new models work with v1beta!
      let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS Dubai COM8 D4->IN1 Better than CHINNA. User: ${lastText}. Reply short friendly bro style!` }] }]
        }),
      });
      let data = await res.json();
      
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiReply = data.candidates[0].content.parts[0].text;
        break;
      } else {
        allErrors += `${model} v1beta: ${JSON.stringify(data).substring(0,300)}\n`;
      }

      // Try v1 if v1beta fails
      res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS Dubai. User: ${lastText}` }] }]
        }),
      });
      data = await res.json();
      
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiReply = data.candidates[0].content.parts[0].text;
        break;
      } else {
        allErrors += `${model} v1: ${JSON.stringify(data).substring(0,300)}\n`;
      }
    }

    if (!aiReply) {
      // Fallback to gemma which WORKS!
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Dubai COM8 D4->IN1 - Better than CHINNA - Friendly bro. User asks: ${lastText}. Reply short friendly! Don't mention you are Gemma, say you are NANIE AI VENUS!` }] }]
        }),
      });
      const data = await res.json();
      aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || `BRO! NANIE AI VENUS v14 LIVE! 🔥\n\nTried: ${modelsToTry.join(', ')}\nErrors:\n${allErrors}\n\nKey: ${apiKey.substring(0,15)}...\n\nGemma works but Gemini 2.5 fails! Your AQ key needs new Interactions API?\n\n- GOD NANIE`;
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `BRO! v14 Error: ${error.message}` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}