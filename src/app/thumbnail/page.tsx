'use client';

import { useState } from 'react';
import { Copy, Trash2, ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generateThumbnailPrompt } from '@/lib/prompts';
import { copyToClipboard } from '@/lib/utils';
import { saveToHistory } from '@/lib/history';
import type { ThumbnailStyle } from '@/types';

const styles: { value: ThumbnailStyle; label: string }[] = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'devotional', label: 'Devotional' },
  { value: 'worship', label: 'Worship' },
  { value: 'folk', label: 'Folk' },
  { value: 'festival', label: 'Festival' },
];

export default function ThumbnailGenerator() {
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState<ThumbnailStyle>('cinematic');
  const [language, setLanguage] = useState<'english' | 'telugu'>('english');
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title) return;
    try {
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, style, language }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPrompt(data.prompt);
      saveToHistory('thumbnail', title, data.prompt, { style, language });
    } catch (error) {
      console.error('Generation failed:', error);
      // Fallback to template
      const generated = generateThumbnailPrompt(title, style, language);
      setPrompt(generated);
      saveToHistory('thumbnail', title, generated, { style, language });
    }
  };

  const handleCopy = async () => {
    if (!prompt) return;
    await copyToClipboard(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTitle('');
    setPrompt('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Thumbnail Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate AI-powered thumbnail prompts for YouTube videos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Input Settings
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="YouTube Video Title"
              placeholder="Enter your video title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <Select
              label="Thumbnail Style"
              value={style}
              onChange={(e) => setStyle(e.target.value as ThumbnailStyle)}
              options={styles}
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
              <ImageIcon className="w-4 h-4 mr-2" />
              Generate Prompt
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
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 min-h-[300px] whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {prompt}
                </div>
                <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
                  <div className="text-center space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-gray-400">16:9 Preview Area</p>
                    <p className="text-sm text-gray-500">Use prompt with AI image generator</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center text-gray-400">
                <div className="text-center space-y-2">
                  <ImageIcon className="w-12 h-12 mx-auto" />
                  <p>Enter a title and click Generate</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
