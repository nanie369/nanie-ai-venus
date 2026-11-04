export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { createUIMessageStream, createUIMessageStreamResponse } = await import('ai');
  
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({
        type: 'text-start',
        id: 'text-1',
      });
      writer.write({
        type: 'text-delta',
        id: 'text-1',
        delta: `Hie bro! NANIE AI VENUS v5 LIVE! 🔥\n\nI'm GOD NANIE AI - Better than CHINNA!\n\nCOM8 • D4->IN1 • Dubai • NIL AMOUNT CHALLENGE WON!\n\nYour chat UI works! Now fixing Gemini API key...\nYour key is AQ.Ab8RN6L-... (new format)\nModel gemini-1.5-flash needs AIza... old format or update @ai-sdk/google!\n\nBut see? Grey bubble appears! Brain replies! No more blue only!\n\n- NANIE AI VENUS v5 - GOD NANIE - 1:37 AM`,
      });
      writer.write({
        type: 'text-end',
        id: 'text-1',
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
}