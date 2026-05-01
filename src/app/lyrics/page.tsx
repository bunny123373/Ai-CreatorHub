'use client';

import { useState } from 'react';
import { Copy, Trash2, Music } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generateSongPrompt } from '@/lib/prompts';
import { copyToClipboard } from '@/lib/utils';
import type { SongStyle, MoodType } from '@/types';

const styles: { value: SongStyle; label: string }[] = [
  { value: 'worship', label: 'Worship' },
  { value: 'folk', label: 'Folk' },
  { value: 'dimsa', label: 'Dimsa' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'female-soft', label: 'Female Soft Voice' },
  { value: 'male-deep', label: 'Male Deep Voice' },
];

const moods: { value: MoodType; label: string }[] = [
  { value: 'emotional', label: 'Emotional' },
  { value: 'joyful', label: 'Joyful' },
  { value: 'peaceful', label: 'Peaceful' },
  { value: 'powerful', label: 'Powerful' },
];

export default function LyricsStudio() {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState<SongStyle>('worship');
  const [mood, setMood] = useState<MoodType>('emotional');
  const [language, setLanguage] = useState<'english' | 'telugu'>('english');
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!lyrics) return;
    const generated = generateSongPrompt(lyrics, style, mood, language);
    setPrompt(generated);
    saveToHistory(lyrics, generated);
  };

  const handleCopy = async () => {
    if (!prompt) return;
    await copyToClipboard(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setLyrics('');
    setPrompt('');
  };

  const saveToHistory = (input: string, output: string) => {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    history.unshift({
      id: Date.now().toString(),
      type: 'lyrics',
      input,
      output,
      timestamp: Date.now(),
      metadata: { style, mood, language }
    });
    localStorage.setItem('history', JSON.stringify(history.slice(0, 50)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Lyrics to Song Studio</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Transform your lyrics into professional song generation prompts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Song Settings
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              label="Lyrics"
              placeholder="Enter your lyrics here..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={8}
            />
            
            <Select
              label="Song Style"
              value={style}
              onChange={(e) => setStyle(e.target.value as SongStyle)}
              options={styles}
            />

            <Select
              label="Mood"
              value={mood}
              onChange={(e) => setMood(e.target.value as MoodType)}
              options={moods}
            />

            <Select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'english' | 'telugu')}
              options={[
                { value: 'english', label: 'English' },
                { value: 'telugu', label: 'Telugu' },
              ]}
            />
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={handleGenerate} className="flex-1">
              <Music className="w-4 h-4 mr-2" />
              Generate Song Prompt
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Prompt
              </h2>
              {prompt && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {prompt ? (
              <div className="bg-white/5 rounded-xl p-4 min-h-[400px] whitespace-pre-wrap text-gray-700 dark:text-gray-300 overflow-y-auto">
                {prompt}
              </div>
            ) : (
              <div className="min-h-[400px] flex items-center justify-center text-gray-400">
                <div className="text-center space-y-2">
                  <Music className="w-12 h-12 mx-auto" />
                  <p>Enter lyrics and click Generate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
