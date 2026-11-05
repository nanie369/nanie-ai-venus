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
        contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Free AI agent. User: ${lastText}. Reply short friendly like "Hey bro! NANIE AI VENUS here, what's up?" Do NOT show reasoning, persona, constraints. Just final answer.` }] }]
      }),
    });

    const data = await res.json();
    let aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (aiReply.includes('Hey bro! NANIE AI VENUS here')) {
      const parts = aiReply.split('Hey bro! NANIE AI VENUS here');
      aiReply = 'Hey bro! NANIE AI VENUS here' + parts[parts.length - 1];
      aiReply = aiReply.replace(/"+$/g, '').replace(/^"+/g, '').trim();
    }
    aiReply = aiReply.replace(/User's Persona Request:.*?(\n|$)/g, '')
                     .replace(/Constraints:.*?(\n|$)/g, '')
                     .replace(/Revised Answer Construction:.*?(\n|$)/g, '')
                     .replace(/"+$/g, '').replace(/^"+/g, '')
                     .trim();
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