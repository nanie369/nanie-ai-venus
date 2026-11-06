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
        contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Free AI Agent, Brain v21 Super Brain. You help with: Code, Math, Ideas, Translate, YouTube summaries, TikTok captions, Home automation ESP32, Tech support. User: ${lastText}. Reply friendly like "Hey bro! NANIE AI VENUS here, what's up? [answer]" Short, helpful, no bullet reasoning check, no persona talk, no leak. If user asks code, give code. If math, solve step by step. If TikTok, give viral caption. If YouTube, summarize.` }] }]
      }),
    });
    const data = await res.json();
    let aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (aiReply.includes('Does it show')) aiReply = aiReply.split('Does it show')[0];
    if (aiReply.includes('* Does it')) aiReply = aiReply.split('* Does it')[0];
    if (aiReply.includes('* Is it')) aiReply = aiReply.split('* Is it')[0];
    aiReply = aiReply.split('\n').slice(0,8).join('\n').trim().replace(/"+$/g,'').replace(/^"+/g,'').trim();
    if (!aiReply || aiReply.length < 10) aiReply = `Hey bro! NANIE AI VENUS here, what's up?`;
    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const stream = createUIMessageStream({ execute: ({ writer }) => { writer.write({ type: 'text-start', id: 'text-1' }); writer.write({ type: 'text-delta', id: 'text-1', delta: aiReply }); writer.write({ type: 'text-end', id: 'text-1' }); }, });
    return createUIMessageStreamResponse({ stream });
  } catch (error: any) {
    const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
    const stream = createUIMessageStream({ execute: ({ writer }) => { writer.write({ type: 'text-start', id: 'text-1' }); writer.write({ type: 'text-delta', id: 'text-1', delta: `Hey bro! NANIE AI VENUS here, what's up?` }); writer.write({ type: 'text-end', id: 'text-1' }); }, });
    return createUIMessageStreamResponse({ stream });
  }
}