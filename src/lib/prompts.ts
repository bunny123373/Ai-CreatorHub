import type { 
  ThumbnailStyle, 
  SongStyle, 
  MoodType 
} from '@/types';

export function generateThumbnailPrompt(
  title: string, 
  style: ThumbnailStyle, 
  language: 'english' | 'telugu'
): string {
  const stylePrompts: Record<ThumbnailStyle, string> = {
    cinematic: 'A cinematic, dramatic YouTube thumbnail with movie-quality lighting, depth of field, and epic composition. 16:9 aspect ratio, high contrast, golden hour lighting.',
    devotional: 'A divine, spiritual YouTube thumbnail with sacred imagery, soft glowing light, peaceful atmosphere, religious symbols, warm golden tones, ethereal glow.',
    worship: 'An uplifting worship YouTube thumbnail with raised hands, light beams, heavenly atmosphere, warm colors, inspirational mood, church background.',
    folk: 'A vibrant folk art YouTube thumbnail with traditional patterns, earthy colors, cultural elements, rustic charm, handcrafted aesthetic, rural beauty.',
    festival: 'A colorful festival YouTube thumbnail with celebration vibes, bright decorations, festive lights, flowers, joy and energy, traditional attire.'
  };

  const basePrompt = language === 'telugu' 
    ? `తెలుగు వీడియో కోసం థంబ్‌నెయిల్: "${title}"`
    : `YouTube thumbnail for: "${title}"`;

  return `${basePrompt}\n\n${stylePrompts[style]}\n\nProfessional thumbnail design, high click-through rate, bold text overlay area, eye-catching composition, 4K quality, YouTube optimized.`;
}

export function generateSongPrompt(
  lyrics: string,
  style: SongStyle,
  mood: MoodType,
  language: 'english' | 'telugu'
): string {
  const styleDescriptions: Record<SongStyle, string> = {
    worship: 'worship song style with uplifting melodies, church choir background, organ and piano, spiritual atmosphere',
    folk: 'folk song style with acoustic instruments, traditional rhythm, cultural authenticity, earthy vocals',
    dimsa: 'Dimsa tribal song style with traditional percussion, ethnic vocals, tribal rhythm patterns, earthy instrumentation',
    cinematic: 'cinematic song style with orchestral arrangement, epic build-ups, movie soundtrack quality, dramatic dynamics',
    'female-soft': 'soft female vocals with gentle delivery, breathy tone, delicate emotion, intimate microphone presence',
    'male-deep': 'deep male vocals with rich baritone, powerful resonance, commanding presence, warm low tones'
  };

  const moodDescriptions: Record<MoodType, string> = {
    emotional: 'emotional delivery with heartfelt expression, vulnerable vocals, touching melody',
    joyful: 'joyful delivery with upbeat tempo, happy energy, celebratory vocals',
    peaceful: 'peaceful delivery with calm tempo, soothing vocals, tranquil atmosphere',
    powerful: 'powerful delivery with strong vocals, dynamic range, intense emotion'
  };

  const lyricsPreview = lyrics.substring(0, 200);
  const langNote = language === 'telugu' ? 'తెలుగు పాటగా పాడాలి' : 'Sing in English';

  return `Create a ${styleDescriptions[style]}. ${moodDescriptions[mood]}. ${langNote}.

Lyrics:
${lyricsPreview}...

Music production notes: High quality mixing, professional mastering, streaming platform ready.`;
}

export function generateViralTitles(
  topic: string,
  language: 'english' | 'telugu'
): string[] {
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

export function generateSEOTags(topic: string): string[] {
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

export function generateDescription(topic: string): string {
  return `🎬 Welcome to our channel! In this video, we dive deep into ${topic}.

✨ What you'll learn in this video:
• Everything about ${topic}
• Pro tips and strategies
• Expert insights and analysis
• Step-by-step guide

🔔 SUBSCRIBE for more content like this!
👍 SMASH that like button if you found this helpful!
💬 Comment below with your thoughts!

#${topic.replace(/\s+/g, '')} #Trending #YouTube2026

⏰ Timestamps:
00:00 - Introduction
02:00 - Main Content
05:00 - Pro Tips
08:00 - Conclusion

📧 Business Inquiries: contact@example.com
🌐 Website: www.example.com

Thanks for watching! Don't forget to subscribe and hit the notification bell! 🔔`;
}
