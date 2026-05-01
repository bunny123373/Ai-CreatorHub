'use client';

import { useState } from 'react';
import { Copy, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateDescription } from '@/lib/prompts';
import { copyToClipboard } from '@/lib/utils';

export default function DescriptionGenerator() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic) return;
    const generated = generateDescription(topic);
    setDescription(generated);
    saveToHistory(topic, generated);
  };

  const handleCopy = async () => {
    if (!description) return;
    await copyToClipboard(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToHistory = (input: string, output: string) => {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    history.unshift({
      id: Date.now().toString(),
      type: 'description',
      input,
      output,
      timestamp: Date.now(),
    });
    localStorage.setItem('history', JSON.stringify(history.slice(0, 50)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Description Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate SEO-optimized YouTube descriptions
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
            <FileText className="w-4 h-4 mr-2" />
            Generate Description
          </Button>
        </CardContent>
      </Card>

      {description && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Description
              </h2>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Description'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white/5 rounded-xl p-4 min-h-[400px] whitespace-pre-wrap text-gray-700 dark:text-gray-300 overflow-y-auto">
              {description}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
