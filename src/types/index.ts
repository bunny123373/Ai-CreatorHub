export type Theme = 'light' | 'dark';

export type ThumbnailStyle = 
  | 'cinematic' 
  | 'devotional' 
  | 'worship' 
  | 'folk' 
  | 'festival';

export type SongStyle = 
  | 'worship' 
  | 'folk' 
  | 'dimsa' 
  | 'cinematic' 
  | 'female-soft' 
  | 'male-deep';

export type MoodType = 
  | 'emotional' 
  | 'joyful' 
  | 'peaceful' 
  | 'powerful';

export interface HistoryItem {
  id: string;
  type: 'thumbnail' | 'lyrics' | 'title' | 'tags' | 'description';
  input: string;
  output: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ThumbnailGeneration {
  title: string;
  style: ThumbnailStyle;
  language: 'english' | 'telugu';
  prompt: string;
}

export interface LyricsGeneration {
  lyrics: string;
  style: SongStyle;
  mood: MoodType;
  language: 'english' | 'telugu';
  prompt: string;
}

export interface ViralTitleGeneration {
  topic: string;
  language: 'english' | 'telugu';
  titles: string[];
}

export interface SEOTagsGeneration {
  topic: string;
  tags: string[];
}

export interface DescriptionGeneration {
  topic: string;
  description: string;
}
