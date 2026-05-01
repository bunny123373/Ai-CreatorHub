import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { lyrics, style, mood, language } = await request.json();

    if (!lyrics) {
      return NextResponse.json({ error: 'Lyrics are required' }, { status: 400 });
    }

    const prompt = `Create a professional song production prompt based on these lyrics:\n\n"${lyrics.substring(0, 500)}..."\n\nStyle: ${style}\nMood: ${mood}\nLanguage: ${language}\n\nGenerate a detailed prompt that includes:\n- Vocal style and technique\n- Instrumentation and arrangement\n- Mood and energy level\n- Production quality and mixing notes\n- Specific instructions for ${language === 'telugu' ? 'Telugu' : 'English'} vocals`;

    let generatedPrompt = '';
    
    if (process.env.ANTHROPIC_API_KEY) {
      generatedPrompt = await generateWithAnthropic(prompt);
    } else if (process.env.OPENAI_API_KEY) {
      generatedPrompt = await generateWithOpenAI(prompt);
    } else {
      generatedPrompt = generateFallbackLyricsPrompt(lyrics, style, mood, language);
    }

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Lyrics generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate song prompt' },
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
      max_tokens: 1500,
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
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateFallbackLyricsPrompt(
  lyrics: string,
  style: string,
  mood: string,
  language: string
): string {
  const styleDescriptions: Record<string, string> = {
    worship: 'worship song style with uplifting melodies, church choir background, organ and piano, spiritual atmosphere',
    folk: 'folk song style with acoustic instruments, traditional rhythm, cultural authenticity, earthy vocals',
    dimsa: 'Dimsa tribal song style with traditional percussion, ethnic vocals, tribal rhythm patterns, earthy instrumentation',
    cinematic: 'cinematic song style with orchestral arrangement, epic build-ups, movie soundtrack quality, dramatic dynamics',
    'female-soft': 'soft female vocals with gentle delivery, breathy tone, delicate emotion, intimate microphone presence',
    'male-deep': 'deep male vocals with rich baritone, powerful resonance, commanding presence, warm low tones',
  };

  const moodDescriptions: Record<string, string> = {
    emotional: 'emotional delivery with heartfelt expression, vulnerable vocals, touching melody',
    joyful: 'joyful delivery with upbeat tempo, happy energy, celebratory vocals',
    peaceful: 'peaceful delivery with calm tempo, soothing vocals, tranquil atmosphere',
    powerful: 'powerful delivery with strong vocals, dynamic range, intense emotion',
  };

  const styleDesc = styleDescriptions[style] || styleDescriptions.worship;
  const moodDesc = moodDescriptions[mood] || moodDescriptions.emotional;
  const langNote = language === 'telugu' ? 'తెలుగు పాటగా పాడాలి' : 'Sing in English';

  return `Create a ${styleDesc}. ${moodDesc}. ${langNote}.\n\nLyrics:\n${lyrics.substring(0, 200)}...\n\nMusic production notes: High quality mixing, professional mastering, streaming platform ready.`;
}
