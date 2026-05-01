'use client';

import { useState } from 'react';
import { Copy, Tags } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateSEOTags } from '@/lib/prompts';
import { copyToClipboard } from '@/lib/utils';

export default function SEOTags() {
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic) return;
    const generated = generateSEOTags(topic);
    setTags(generated);
    saveToHistory(topic, generated);
  };

  const handleCopy = async () => {
    const tagString = tags.join(', ');
    await copyToClipboard(tagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = async () => {
    const tagString = tags.join('\n');
    await copyToClipboard(tagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToHistory = (input: string, output: string[]) => {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    history.unshift({
      id: Date.now().toString(),
      type: 'tags',
      input,
      output: output.join(', '),
      timestamp: Date.now(),
    });
    localStorage.setItem('history', JSON.stringify(history.slice(0, 50)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">SEO Tags Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate optimized YouTube tags for better discoverability
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

          <Button onClick={handleGenerate} className="w-full">
            <Tags className="w-4 h-4 mr-2" />
            Generate SEO Tags
          </Button>
        </CardContent>
      </Card>

      {tags.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Tags
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy as comma-separated'}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-gray-700 dark:text-gray-300 text-sm hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => copyToClipboard(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
