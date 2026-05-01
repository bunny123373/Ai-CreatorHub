import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, style, language } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const prompt = `Generate a YouTube thumbnail prompt for: "${title}"\n\nStyle: ${style}\nLanguage: ${language}\n\nCreate a detailed, professional thumbnail prompt that includes:\n- Composition and layout\n- Color scheme and lighting\n- Text overlay suggestions\n- Visual elements and focal points\n- 16:9 aspect ratio optimization\n- High CTR (click-through rate) design principles`;

    // Try Anthropic Claude first, fallback to OpenAI
    let generatedPrompt = '';
    
    if (process.env.ANTHROPIC_API_KEY) {
      generatedPrompt = await generateWithAnthropic(prompt, 'thumbnail');
    } else if (process.env.OPENAI_API_KEY) {
      generatedPrompt = await generateWithOpenAI(prompt, 'thumbnail');
    } else {
      // Fallback to enhanced template if no API key
      generatedPrompt = generateFallbackThumbnailPrompt(title, style, language);
    }

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail prompt' },
      { status: 500 }
    );
  }
}

async function generateWithAnthropic(prompt: string, type: string): Promise<string> {
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

async function generateWithOpenAI(prompt: string, type: string): Promise<string> {
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

function generateFallbackThumbnailPrompt(
  title: string,
  style: string,
  language: string
): string {
  const stylePrompts: Record<string, string> = {
    cinematic: 'A cinematic, dramatic YouTube thumbnail with movie-quality lighting, depth of field, and epic composition. 16:9 aspect ratio, high contrast, golden hour lighting.',
    devotional: 'A divine, spiritual YouTube thumbnail with sacred imagery, soft glowing light, peaceful atmosphere, religious symbols, warm golden tones, ethereal glow.',
    worship: 'An uplifting worship YouTube thumbnail with raised hands, light beams, heavenly atmosphere, warm colors, inspirational mood, church background.',
    folk: 'A vibrant folk art YouTube thumbnail with traditional patterns, earthy colors, cultural elements, rustic charm, handcrafted aesthetic, rural beauty.',
    festival: 'A colorful festival YouTube thumbnail with celebration vibes, bright decorations, festive lights, flowers, joy and energy, traditional attire.',
  };

  const stylePrompt = stylePrompts[style] || stylePrompts.cinematic;
  const langNote = language === 'telugu' ? `తెలుగు వీడియో కోసం థంబ్‌నెయిల్: "${title}"` : `YouTube thumbnail for: "${title}"`;

  return `${langNote}\n\n${stylePrompt}\n\nProfessional thumbnail design, high click-through rate, bold text overlay area, eye-catching composition, 4K quality, YouTube optimized.`;
}
