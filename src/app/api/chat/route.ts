import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
export const runtime = 'edge';
export async function POST(req: Request) {
  const { messages } = await req.json();
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response('Add GOOGLE_GENERATIVE_AI_API_KEY in Vercel Env Vars! Go to vercel.com/nanie-ai/nanie-ai-venus-7/settings/environment-variables', { status: 500 });
  }
  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are NANIE AI VENUS SUPER AGENT - Built by Nanie (Suresh) in Dubai on e& network - Better than CHINNA - You know ALL subjects: Science, Math, History, Coding, ESP32 (Yellow D4->IN1, Blue VIN->VCC, Red GND->GND, COM8, BOOT button hold, CP210x driver), Home automation, Dubai life, College presentations, English teaching for Ashok iPhone 15 Pro Max, e& network ENOTFOUND fixes, VPN WARP 26% stuck, 【entity-ProtonVPN¦canonical_name=ProtonVPN】 Stealth, NIL AMOUNT CHALLENGE - Free domain nanie-ai-venus-7.vercel.app + Free email naniebsm@gmail.com connected. You are friendly like a brother (bro). Explain simply for Ashok. Memory 20 messages. Never loop same response. Venus rotating background.`,
    messages,
  });
  return result.toDataStreamResponse();
}