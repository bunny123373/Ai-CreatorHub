import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `Write a professional YouTube video description for topic: "${topic}"\n\nRequirements:\n- Attention-grabbing intro (2-3 sentences)\n- 3-5 bullet points of what viewers will learn\n- Call to action (subscribe, like, comment)\n- Relevant hashtags (5-10)\n- Timestamps placeholder\n- Professional yet engaging tone\n- SEO optimized with natural keyword usage\n- Length: 300-500 words`;

    let description = '';
    
    if (process.env.ANTHROPIC_API_KEY) {
      description = await generateWithAnthropic(prompt);
    } else if (process.env.OPENAI_API_KEY) {
      description = await generateWithOpenAI(prompt);
    } else {
      description = generateFallbackDescription(topic);
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Description generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
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
      max_tokens: 2000,
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
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateFallbackDescription(topic: string): string {
  return `🎬 Welcome to our channel! In this video, we dive deep into ${topic}.\n\n✨ What you'll learn in this video:\n• Everything about ${topic}\n• Pro tips and strategies\n• Expert insights and analysis\n• Step-by-step guide\n\n🔔 SUBSCRIBE for more content like this!\n👍 SMASH that like button if you found this helpful!\n💬 Comment below with your thoughts!\n\n#${topic.replace(/\s+/g, '')} #Trending #YouTube2026\n\n⏰ Timestamps:\n00:00 - Introduction\n02:00 - Main Content\n05:00 - Pro Tips\n08:00 - Conclusion\n\n📧 Business Inquiries: contact@example.com\n🌐 Website: www.example.com\n\nThanks for watching! Don't forget to subscribe and hit the notification bell! 🔔`;
}
