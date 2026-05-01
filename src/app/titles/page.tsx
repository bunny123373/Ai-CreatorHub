'use client';

import { useState } from 'react';
import { Copy, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generateViralTitles } from '@/lib/prompts';
import { copyToClipboard } from '@/lib/utils';
import { saveToHistory } from '@/lib/history';

export default function ViralTitles() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'english' | 'telugu'>('english');
  const [titles, setTitles] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setTitles(data.titles);
      saveToHistory('title', topic, data.titles.join('\n'), { language });
    } catch (error) {
      console.error('Generation failed:', error);
      // Fallback to template
      const generated = generateViralTitles(topic, language);
      setTitles(generated);
      saveToHistory('title', topic, generated.join('\n'), { language });
    }
  };

  const handleCopy = async (title: string, index: number) => {
    await copyToClipboard(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await copyToClipboard(titles.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Viral Title Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate viral YouTube titles that drive clicks
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Input
            label="Video Topic"
            placeholder="Enter your video topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
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

          <Button onClick={handleGenerate} className="w-full">
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Viral Titles
          </Button>
        </CardContent>
      </Card>

      {titles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Titles
              </h2>
              <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                <Copy className="w-4 h-4 mr-2" />
                {copiedIndex === -1 ? 'Copied All!' : 'Copy All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {titles.map((title, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300 flex-1">
                    {index + 1}. {title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(title, index)}
                  >
                    <Copy className="w-4 h-4" />
                    {copiedIndex === index && <span className="ml-2">Copied!</span>}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
