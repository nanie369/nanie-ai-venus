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

    // New AQ keys need new models: 2.5-pro, flash-latest, pro-latest, 2.0-flash-001
    const modelsToTry = [
      'gemini-2.5-pro',
      'gemini-2.0-flash-001',
      'gemini-1.5-flash-001',
      'gemini-flash-latest',
      'gemini-pro-latest',
      'gemini-2.5-flash-preview-04-17',
      'gemini-2.0-flash-lite-001'
    ];
    
    let aiReply = '';
    let lastError = '';

    for (const model of modelsToTry) {
      // Try v1 API first (new AQ keys work better with v1)
      let res = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: lastText }] }],
          systemInstruction: { parts: [{ text: `You are NANIE AI VENUS - Dubai COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT - e& ENOTFOUND fix. Friendly bro.` }] }
        }),
      });
      let data = await res.json();
      
      // If v1 fails, try v1beta
      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: lastText }] }],
            systemInstruction: { parts: [{ text: `You are NANIE AI VENUS - Dubai - Better than CHINNA` }] }
          }),
        });
        data = await res.json();
      }
      
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiReply = data.candidates[0].content.parts[0].text;
        break;
      } else {
        lastError = `${model}: ${JSON.stringify(data).substring(0,300)}`;
      }
    }

    if (!aiReply) {
      // List available models
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const listData = await listRes.json();
      const available = listData.models?.slice(0,5).map((m:any)=>m.name).join(', ') || 'No models listed';
      aiReply = `BRO! NANIE AI VENUS v12 LIVE! 🔥\n\nTried: ${modelsToTry.join(', ')}\nLast Error: ${lastError}\n\nAvailable models for your AQ key: ${available}\n\nKey: ${apiKey.substring(0,15)}...\n\nGo to https://aistudio.google.com/app/apikey and check models!\n\n- GOD NANIE`;
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `BRO! v12 Error: ${error.message}` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}