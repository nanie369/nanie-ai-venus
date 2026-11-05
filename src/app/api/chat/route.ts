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

    // Use gemma which WORKS with AQ key, but tell it NOT to leak reasoning!
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Built by Nanie in Dubai COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT - Free domain nanie-ai-venus-7.vercel.app. User says: "${lastText}". Reply short friendly like bro: "Hey bro! NANIE AI VENUS here, what's up?" style. IMPORTANT: Do NOT show your reasoning, persona, constraints, or thinking process. Do NOT say Persona:, Constraint:, Response needs to be, Short? Yes, etc. Just give final answer directly like "Hey bro! NANIE AI VENUS here. What's up?"` }] }]
      }),
    });

    const data = await res.json();
    let aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean up leaked reasoning if still there - extract only final answer
    if (aiReply.includes('Hey bro! NANIE AI VENUS')) {
      const match = aiReply.match(/Hey bro! NANIE AI VENUS[^"]*/);
      if (match) aiReply = match[0];
    }
    if (aiReply.includes('Persona:') || aiReply.includes('Constraint:')) {
      // Take last line which is final answer
      const lines = aiReply.split('\n').filter((l:string)=>l.trim());
      const lastLine = lines[lines.length - 1];
      if (lastLine.includes('NANIE AI VENUS')) aiReply = lastLine.replace(/"/g, '');
    }

    if (!aiReply) {
      aiReply = `Hey bro! NANIE AI VENUS here. What's up? 😊 Your e& ENOTFOUND error means ESP32 can't find e& WiFi! Use 2.4GHz, check SSID, restart! - GOD NANIE`;
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `Hey bro! NANIE AI VENUS here. What's up? Your e& ENOTFOUND fix: Use 2.4GHz WiFi! - GOD NANIE` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}