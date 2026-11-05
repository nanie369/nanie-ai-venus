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

    // Try REAL Gemini models from your AQ key list - 2.5-flash and 2.5-pro!
    const geminiModels = ['gemini-2.5-flash', 'gemini-2.5-pro'];
    let aiReply = '';

    for (const model of geminiModels) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Built by Nanie in Dubai COM8 D4->IN1 Yellow->IN1 Blue VCC Red GND - Better than CHINNA - e& ENOTFOUND fix - ESP32. User: ${lastText}. Reply short friendly bro style, no reasoning leak, just final answer like "Hey bro! NANIE AI VENUS here. What's up?"` }] }]
        }),
      });
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiReply = data.candidates[0].content.parts[0].text;
        break;
      }
    }

    // Fallback to Gemma which you proved works clean!
    if (!aiReply) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Dubai COM8 D4->IN1 - Better than CHINNA - User: ${lastText}. Reply short friendly bro like "Hey bro! NANIE AI VENUS here, what's up?" Do NOT show reasoning, persona, constraints. Just final answer.` }] }]
        }),
      });
      const data = await res.json();
      aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || `Hey bro! NANIE AI VENUS here. What's up? Your e& ENOTFOUND fix: Use 2.4GHz WiFi, check SSID, restart ESP32! - GOD NANIE`;
      // Clean leak if any
      if (aiReply.includes('Persona:') || aiReply.includes('Constraint:')) {
        const lines = aiReply.split('\n').filter((l:string)=>l.trim() && !l.includes('Persona:') && !l.includes('Constraint:') && !l.includes('Response needs') && !l.includes('Short?') && !l.includes('Friendly?'));
        aiReply = lines[lines.length - 1] || aiReply;
      }
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `Hey bro! NANIE AI VENUS here. What's up? Your e& ENOTFOUND: Use 2.4GHz! - GOD NANIE` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}