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

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Free AI agent. User says: ${lastText}. Reply ONLY with "Hey bro! NANIE AI VENUS here, what's up? [answer]" Keep it short friendly. No bullet list, no reasoning check, no persona talk.` }] }]
      }),
    });

    const data = await res.json();
    let aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // CLEAN v20 - Remove all leaks!
    if (aiReply.includes('Does it show')) {
      aiReply = aiReply.split('Does it show')[0];
    }
    if (aiReply.includes('* Is it')) {
      aiReply = aiReply.split('* Is it')[0];
    }
    if (aiReply.includes('* Does it')) {
      aiReply = aiReply.split('* Does it')[0];
    }
    // Keep only first 2 sentences max, clean extra quote
    aiReply = aiReply.split('\n')[0].trim();
    aiReply = aiReply.replace(/"+$/g, '').replace(/^"+/g, '').trim();
    // Fix extra quote in middle
    aiReply = aiReply.replace(/\?"$/g, '?').replace(/what's up\?"}/g, "what's up?").replace(/\?"/g, '?');
    if (!aiReply.includes("what's up?")) {
      aiReply = aiReply.replace(/what's up[^?]*/g, "what's up?");
    }
    if (!aiReply || aiReply.length < 10) {
      aiReply = `Hey bro! NANIE AI VENUS here, what's up?`;
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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `Hey bro! NANIE AI VENUS here, what's up?` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}