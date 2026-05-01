import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `Generate 15 SEO-optimized YouTube tags for topic: "${topic}"\n\nRequirements:\n- Mix of broad and specific tags\n- Include year 2026\n- Add trending and viral tags\n- Include "YouTube" and "tutorial" variations\n- Return as a simple list, one tag per line`;

    let tags: string[] = [];
    
    if (process.env.ANTHROPIC_API_KEY) {
      const text = await generateWithAnthropic(prompt);
      tags = parseTags(text);
    } else if (process.env.OPENAI_API_KEY) {
      const text = await generateWithOpenAI(prompt);
      tags = parseTags(text);
    } else {
      tags = generateFallbackTags(topic);
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Tags generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tags' },
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

function parseTags(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.replace(/^[-•]\s*/, ''))
    .slice(0, 15);
}

function generateFallbackTags(topic: string): string[] {
  const baseTags = [
    topic.toLowerCase(),
    `${topic} tutorial`,
    `${topic} 2026`,
    `youtube ${topic}`,
    `best ${topic}`
  ];

  const additionalTags = [
    'trending',
    'viral video',
    'youtube tips',
    'content creator',
    'video optimization'
  ];

  return [...baseTags, ...additionalTags];
}
