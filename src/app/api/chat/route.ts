import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: google('gemini-2.5-flash'), // Google - e& allows this, no VPN!
    system: 'You are NANIE AI, built by Nanie in Dubai. Friendly bro style.',
    messages,
  });
  return result.toUIMessageStreamResponse();
}