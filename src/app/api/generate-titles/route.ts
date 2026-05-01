import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, language } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `Generate 5 viral YouTube titles for topic: "${topic}"\nLanguage: ${language}\n\nRequirements:\n- Click-worthy and engaging\n- Use power words and curiosity gaps\n- Include relevant emojis\n- Optimize for high CTR\n- Mix of styles (question, how-to, listicle, shocking, emotional)`;

    let titles: string[] = [];
    
    if (process.env.ANTHROPIC_API_KEY) {
      const text = await generateWithAnthropic(prompt);
      titles = parseTitles(text);
    } else if (process.env.OPENAI_API_KEY) {
      const text = await generateWithOpenAI(prompt);
      titles = parseTitles(text);
    } else {
      titles = generateFallbackTitles(topic, language);
    }

    return NextResponse.json({ titles });
  } catch (error) {
    console.error('Title generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    );
  }
}

async function generateWithAnthropic(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseTitles(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && /^\d/.test(line))
    .map(line => line.replace(/^\d+[\.\)]\s*/, ''))
    .slice(0, 5);
}

function generateFallbackTitles(topic: string, language: string): string[] {
  if (language === 'telugu') {
    return [
      `షాక్! ${topic} - మీరు ఊహించని నిజం 🔥`,
      `${topic} గురించి మీకు తెలియని 5 విషయాలు`,
      `వెంటనే చూడండి! ${topic} వెనుక ఉన్న సీక్రెట్`,
      `${topic} - ఇలా చేస్తే మీ లైఫ్ చేంజ్ అవుతుంది!`,
      `ట్రెండింగ్: ${topic} ఎందుకు ఇప్పుడు వైరల్ అవుతోందో తెలుసా?`
    ];
  }

  return [
    `SHOCKING: ${topic} - You Won't Believe This! 🔥`,
    `5 Things You Didn't Know About ${topic}`,
    `Watch This NOW! The Secret Behind ${topic}`,
    `${topic}: Do This and Your Life Will Change!`,
    `VIRAL: Why ${topic} is Trending Right Now`
  ];
}
