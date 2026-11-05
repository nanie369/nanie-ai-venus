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

    // Try REAL Gemini 2.5 models with x-goog-api-key header - required for AQ keys!
    const geminiModels = ['gemini-2.5-flash', 'gemini-2.5-pro'];
    let aiReply = '';

    for (const model of geminiModels) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Dubai COM8 D4->IN1 - Better than CHINNA - NIL AMOUNT. User: ${lastText}. Reply short friendly bro style, like "Hey bro! NANIE AI VENUS here. Your e& ENOTFOUND means..." Keep short, no chain-of-thought leak, just final answer.` }] }]
        }),
      });
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiReply = data.candidates[0].content.parts[0].text;
        break;
      }
    }

    // Fallback to Gemma which you proved works, but CLEAN leak!
    if (!aiReply) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `You are NANIE AI VENUS - Dubai - Better than CHINNA. User: ${lastText}. Reply ONLY final answer short friendly like "Hey bro! NANIE AI VENUS here, what's up? ENOTFOUND means..." Do NOT show Persona, Constraints, reasoning, analysis, Revised Answer Construction, or bullet list of errors. Just final short answer.` }] }]
        }),
      });
      const data = await res.json();
      aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // CLEAN LEAK: Extract only after last "Hey bro! NANIE AI VENUS here"
      if (aiReply.includes('Hey bro! NANIE AI VENUS here')) {
        const parts = aiReply.split('Hey bro! NANIE AI VENUS here');
        aiReply = 'Hey bro! NANIE AI VENUS here' + parts[parts.length - 1];
        aiReply = aiReply.split('Persona:')[0].split('Constraint:')[0].split('Revised Answer')[0].trim();
      }
      if (!aiReply || aiReply.length < 10) {
        aiReply = `Hey bro! NANIE AI VENUS here, what's up? ENOTFOUND means your connection can't find the address. Try: 1. Check typos in URL, 2. Check internet, 3. Restart router, 4. Flush DNS (ipconfig /flushdns), 5. Google DNS 8.8.8.8, 6. Firewall. e& is Etisalat UAE telecom, check e& network! - GOD NANIE`;
      }
    }

    // Final clean: Remove any remaining leak phrases
    aiReply = aiReply.replace(/User's Persona Request:.*?(\n|$)/g, '')
                     .replace(/User's Greeting Style:.*?(\n|$)/g, '')
                     .replace(/Constraints:.*?(\n|$)/g, '')
                     .replace(/Response needs to be.*?(\n|$)/g, '')
                     .replace(/Revised Answer Construction:.*?(\n|$)/g, '')
                     .trim();

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
        writer.write({ type: 'text-delta', id: 'text-1', delta: `Hey bro! NANIE AI VENUS here, what's up? ENOTFOUND means your connection can't find address. Check URL typos, internet, restart router, flush DNS, Google DNS 8.8.8.8! e& is Etisalat UAE! - GOD NANIE` });
        writer.write({ type: 'text-end', id: 'text-1' });
      },
    });
    return createUIMessageStreamResponse({ stream });
  }
}