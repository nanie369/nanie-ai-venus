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
        contents: [{ role: 'user', parts: [{ text: `Hi, reply friendly: ${lastText}` }] }]
      }),
    });
    const data = await res.json();
    let aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // v22 ULTRA CLEAN - Remove ALL leaks
    if (aiReply.includes('User prompt')) aiReply = aiReply.split('User prompt')[0];
    if (aiReply.includes('Core Task')) aiReply = aiReply.split('Core Task')[0];
    if (aiReply.includes('Developer:')) aiReply = aiReply.split('Developer:')[0];
    if (aiReply.includes('Gemma')) aiReply = aiReply.replace(/Gemma/g, 'NANIE AI VENUS');
    if (aiReply.includes('Google DeepMind')) aiReply = aiReply.replace(/Google DeepMind/g, 'NANIE AI VENUS');
    if (aiReply.includes('Conflict:')) aiReply = aiReply.split('Conflict:')[0];
    if (aiReply.includes('Name:')) aiReply = aiReply.split('Name:')[0];
    if (aiReply.includes('Instructions:')) aiReply = aiReply.split('Instructions:')[0];
    aiReply = aiReply.trim();
    if (!aiReply || aiReply.length < 5) aiReply = `Hey bro! NANIE AI VENUS here, what's up?`;
    if (!aiReply.includes('NANIE AI VENUS')) aiReply = `Hey bro! NANIE AI VENUS here, what's up? ` + aiReply;
    aiReply = aiReply.replace(/"+$/g,'').trim();
    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const stream = createUIMessageStream({ execute: ({ writer }) => { writer.write({ type: 'text-start', id: 'text-1' }); writer.write({ type: 'text-delta', id: 'text-1', delta: aiReply }); writer.write({ type: 'text-end', id: 'text-1' }); }, });
    return createUIMessageStreamResponse({ stream });
  } catch (error: any) {
    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const stream = createUIMessageStream({ execute: ({ writer }) => { writer.write({ type: 'text-start', id: 'text-1' }); writer.write({ type: 'text-delta', id: 'text-1', delta: `Hey bro! NANIE AI VENUS here, what's up?` }); writer.write({ type: 'text-end', id: 'text-1' }); }, });
    return createUIMessageStreamResponse({ stream });
  }
}