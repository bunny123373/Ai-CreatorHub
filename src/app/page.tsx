import Link from 'next/link';
import { Image, Music, TrendingUp, Tags, FileText, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'Thumbnail Generator',
    description: 'Create stunning YouTube thumbnails with AI-powered prompts',
    href: '/thumbnail',
    icon: Image,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Lyrics to Song Studio',
    description: 'Transform your lyrics into professional song prompts',
    href: '/lyrics',
    icon: Music,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Viral Title Generator',
    description: 'Generate viral YouTube titles that drive clicks',
    href: '/titles',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'SEO Tags Generator',
    description: 'Generate optimized tags for better discoverability',
    href: '/tags',
    icon: Tags,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Description Generator',
    description: 'Create SEO-optimized YouTube descriptions',
    href: '/description',
    icon: FileText,
    color: 'from-indigo-500 to-blue-500',
  },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-gradient" />
          <h1 className="text-5xl font-bold text-gradient">
            AI Creator Hub
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Premium AI-powered platform for content creators. Generate thumbnails, songs, titles, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full hover:scale-105 transition-transform duration-300">
              <div className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
