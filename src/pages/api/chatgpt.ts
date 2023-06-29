import { VercelRequest, VercelResponse } from "@vercel/node";

interface MessageRequestBody {
  message: string;
}

export default async function (req: VercelRequest, res: VercelResponse) {
  console.log('Running on Edge Runtime:', !!(globalThis as any).EdgeRuntime);

  const { message } = req.body as MessageRequestBody;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    res.status(response.status).json(data);
  } else {
    res.status(200).json({ message: data.choices[0].message.content });
  }
}