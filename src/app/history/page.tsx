'use client';

import { useState, useEffect } from 'react';
import { Trash2, Copy, History as HistoryIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { getHistory, deleteHistoryItem, clearHistory } from '@/lib/history';
import type { HistoryItem } from '@/types';

const typeColors: Record<string, string> = {
  thumbnail: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
  lyrics: 'from-purple-500/20 to-pink-500/20 text-purple-400',
  title: 'from-orange-500/20 to-red-500/20 text-orange-400',
  tags: 'from-green-500/20 to-emerald-500/20 text-green-400',
  description: 'from-indigo-500/20 to-blue-500/20 text-indigo-400',
};

const typeLabels: Record<string, string> = {
  thumbnail: 'Thumbnail',
  lyrics: 'Lyrics Studio',
  title: 'Viral Titles',
  tags: 'SEO Tags',
  description: 'Description',
};

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleCopy = async (item: HistoryItem) => {
    await copyToClipboard(item.output);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient">History</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Recently generated content
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="secondary" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <HistoryIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-gray-400">No history yet</p>
              <p className="text-sm text-gray-500">
                Generated content will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${typeColors[item.type]} border border-white/10`}>
                        {typeLabels[item.type]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Input:</strong> {item.input.substring(0, 100)}
                        {item.input.length > 100 && '...'}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {item.output.substring(0, 200)}
                        {item.output.length > 200 && '...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item)}
                    >
                      <Copy className="w-4 h-4" />
                      {copiedId === item.id && <span className="ml-2">Copied!</span>}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
