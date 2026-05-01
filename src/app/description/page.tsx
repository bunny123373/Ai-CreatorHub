'use client';

import { useState } from 'react';
import { Copy, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateDescription } from '@/lib/prompts';
import { copyToClipboard } from '@/lib/utils';
import { saveToHistory } from '@/lib/history';

export default function DescriptionGenerator() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setDescription(data.description);
      saveToHistory('description', topic, data.description);
    } catch (error) {
      console.error('Generation failed:', error);
      // Fallback to template
      const generated = generateDescription(topic);
      setDescription(generated);
      saveToHistory('description', topic, generated);
    }
  };

  const handleCopy = async () => {
    if (!description) return;
    await copyToClipboard(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
